import os
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
from langchain.output_parsers import RegexParser


# init flask and env
app = Flask(__name__)
CORS(app)
load_dotenv()
key = os.environ.get('OPENAIKEY')


# load embedding model
docembeddings = FAISS.load_local("llm_faiss_index", OpenAIEmbeddings())

# GPT variables
prompt_template = """Use the following pieces of context to answer the question at the end.

This should be in the following format:

Question: [question here]
Helpful Answer: [answer here]
Score: [score between 0 and 100]

Begin!

Context:
---------
{context}
---------
Question: {question}
Helpful Answer:"""

output_parser = RegexParser(
    regex=r"(.*?)\nScore: (.*)",
    output_keys=["answer", "score"],
)

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"],
    output_parser=output_parser
)

chains = {}


# gets a response from GPT
def getanswer(query, sesh_id):
    if sesh_id not in chains:
        chains[sesh_id] = load_qa_chain(OpenAI(temperature=0.7), chain_type="map_rerank", return_intermediate_steps=True, prompt=PROMPT)
    chain = chains[sesh_id]
    relevant_chunks = docembeddings.similarity_search_with_score(query,k=2)
    chunk_docs=[]
    for chunk in relevant_chunks:
        chunk_docs.append(chunk[0])
    results = chain({"input_documents": chunk_docs, "question": query})
    text_reference=""
    for i in range(len(results["input_documents"])):
        text_reference+=results["input_documents"][i].page_content
    output={"Answer":results["output_text"],"Reference":text_reference}
    return output


# handles a received request for a chatbot response
@app.route('/botresponse', methods = ["POST"])
def processclaim():
    try:
        input_json = request.get_json(force=True)
        print(input_json)
        query = input_json["query"]
        id = input_json["sid"]
        print(chains)
        output=getanswer(query, id)
        return output
    except:
        return jsonify({"Status":"Failure --- some error occured"})


# run flask app 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8095, debug=True)