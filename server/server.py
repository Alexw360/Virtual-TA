import os, re, string, time
# from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler 
from langchain.callbacks.manager import CallbackManager
from langchain.chains import RetrievalQA

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
os.environ['OPENAI_API_KEY'] = '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'
# init flask and env
app = Flask(__name__)
CORS(app)
# load_dotenv()


# load embedding model
docembeddings = FAISS.load_local("llm_faiss_index", OpenAIEmbeddings())

# GPT variables
prompt_template = """Use the following pieces of context and the previous chat history to answer the question at the end.

This should be in the following format:

Question: [question here]
Helpful Answer: [answer here]

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

Begin!

Chat History:
{chat_history}

Context:
{context}

Question: {question}
Helpful Answer:"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["chat_history", "context", "question"],
)

chains = {}


# gets a response from GPT
def getanswer(query, sesh_id):
    if sesh_id not in chains:
        prompt = PromptTemplate(input_variables=["chat_history", "context", "question"], template=prompt_template)
        memory = ConversationBufferMemory(input_key="question", memory_key="chat_history")
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        chains[sesh_id] = RetrievalQA.from_chain_type(
            llm=OpenAI(),
            chain_type="stuff",
            retriever=docembeddings.as_retriever(),
            return_source_documents=True,
            callbacks=callback_manager,
            chain_type_kwargs={"prompt": prompt, "memory": memory},
        )
    chain = chains[sesh_id]
    print(chain)
    try:
        results = chain(query)
    except Exception as e:
        print(e)
    print(results)
    answer = results["result"]
    print(answer)
    text_reference = results["source_documents"][0].metadata
    citation = f"{text_reference['source']}, p.{text_reference['page']}"
    output = {"Answer": answer, "Reference": citation}
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
        output = getanswer(query, id)
        processanswer(output)
        print(output)
        return output
    except:
        return jsonify({"Status": "Failure --- some error occured"})


# run flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8095, debug=True)
