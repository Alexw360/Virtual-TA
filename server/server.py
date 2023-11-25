import os, re, string, time
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.document_loaders import DirectoryLoader
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.output_parsers import RegexParser


# init flask and env
app = Flask(__name__)
CORS(app)
load_dotenv()
key = os.environ.get("OPENAIKEY")


# load embedding model
docembeddings = FAISS.load_local("llm_faiss_index", OpenAIEmbeddings())

# GPT variables
prompt_template = """Use the following pieces of context to answer the question at the end.

This should be in the following format:

Question: [question here]
Helpful Answer: [answer here]
Score: [score between 0 and 100]

If you are asked to graph a line, respond using the following format:

!GRAPH [line] END

Where [line] is replaced with the equation of the line.

If a given [line] value is in the form O([value]), where [value] is some string, change [line] to just be [value].
If a given [line] value starts with 'y =', then remove that part of the value.
MAKE SURE ALL [line] VALUES ARE WRITTEN IN LaTeX.
If multiple lines are given, write all [line] values before END.
Separate multiple [line] values with a semicolon.
If any of the above conditions fail, respond saying why.
Make sure to provide this in the 'Helpful Answer:' section of the response.

**VirtualTA Bot:**
Designed to assist with questions about a given class.

Begin!

Context:
---------
{context}
---------

Chat History:
-------------
{chat_history}
-------------

Question: {question}
Helpful Answer:"""


output_parser = RegexParser(
    regex=r"(.*?)\nScore: (.*)",
    output_keys=["answer", "score"],
)

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "chat_history" "question"],
    output_parser=output_parser,
)

chains = {}


# gets a response from GPT
def getanswer(query, sesh_id):
    if sesh_id not in chains:
        chains[sesh_id] = (
            load_qa_chain(
                OpenAI(),
                chain_type="map_rerank",
                return_intermediate_steps=True,
                prompt=PROMPT,
            ),
            "",
        )
    chain = chains[sesh_id][0]
    chat_history = chains[sesh_id][1]
    relevant_chunks = docembeddings.similarity_search_with_score(query, k=2)
    chunk_docs = []
    for chunk in relevant_chunks:
        chunk_docs.append(chunk[0])
    results = chain(
        {"input_documents": chunk_docs, "chat_history": chat_history, "question": query}
    )
    text_reference = ""
    for i in range(len(results["input_documents"])):
        text_reference += results["input_documents"][i].page_content
    answer = results["output_text"]
    output = {"Answer": answer, "Reference": text_reference}
    chat_history += "Human: " + query + "\nVirtualTA: " + answer + "\n"
    chains[sesh_id][1] = chat_history
    return output


# checks if graph is present and isolates it from answer
def processanswer(inputAnswer):
    text: str = inputAnswer["Answer"]
    start = text.find("!GRAPH")
    end = text.find("END")
    if start == -1:
        inputAnswer["Graph"] = []
        return
    inputAnswer["Reference"] = ""
    graph = text[start + len("!GRAPH") : end]
    text = text.replace("!GRAPH" + graph + "END", "")
    if text.strip() == "":
        text = "Graph:"
    graph = graph.strip()
    inputAnswer["Graph"] = [replacesqrt(replacelog(x)) for x in graph.split(";")]
    inputAnswer["Answer"] = text
    inputAnswer["GraphID"] = generateID()


# generates a random id based on timestamp
def generateID():
    chars = string.ascii_letters + string.digits
    timestamp = int(time.time() * 1000)
    id = ""
    while timestamp > 0:
        id = chars[timestamp % 62] + id
        timestamp //= 62
    id = id[-6:]
    return id


# TODO: temporary functions to change log -> \\log and sqrt{...} -> \\sqrt{...} if ChatGPT forgets to, replace with unicode to LaTeX parser
def replacelog(s):
    pattern = r"(\\?)log"

    def replace(match):
        if not match.group(1):
            return "\\log"
        else:
            return match.group(0)

    return re.sub(pattern, replace, s)


def replacesqrt(s):
    pattern = r"(\\?)sqrt([\{|\(].*?[\}|\)])"

    def replace(match):
        if not match.group(1):
            return "\\sqrt(" + match.group(2)[1:-1] + ")"
        else:
            return match.group(0)

    return re.sub(pattern, replace, s)


# handles a received request for a chatbot response
@app.route("/botresponse", methods=["POST"])
def processclaim():
    try:
        input_json = request.get_json(force=True)
        print(input_json)
        query = input_json["query"]
        id = input_json["sid"]
        print(chains)
        output = getanswer(query, id)
        processanswer(output)
        print(output)
        return output
    except:
        return jsonify({"Status": "Failure --- some error occured"})


# run flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8095, debug=True)
