from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import os
from dotenv import load_dotenv
from openai import OpenAI 
import logging

load_dotenv()  # .env 파일에서 환경 변수 로드

app = Flask(__name__)
# CORS(app)

# MongoDB 연결 설정
mongo_client = MongoClient(os.getenv("MONGODB_URI"), server_api=ServerApi('1'))
db = mongo_client.baby_growth
records_collection = db.records

client = OpenAI()  # .env 파일에서 환경 변수 OPENAI_API_KEY 로드

# 로깅 설정
logging.basicConfig(level=logging.INFO)

@app.route('/records', methods=['GET'])
def get_records():
    records = list(records_collection.find())
    for record in records:
        record['_id'] = str(record['_id'])
    return jsonify(records)

@app.route('/records', methods=['POST'])
def add_record():
    data = request.json
    record_id = records_collection.insert_one(data).inserted_id
    return jsonify(str(record_id)), 201

@app.route('/records/<record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.json
    records_collection.update_one({'_id': ObjectId(record_id)}, {'$set': data})
    return jsonify({'msg': 'Record updated'})

@app.route('/records/<record_id>', methods=['DELETE'])
def delete_record(record_id):
    records_collection.delete_one({'_id': ObjectId(record_id)})
    return jsonify({'msg': 'Record deleted'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get('input', '')
    
    # 여기서 현재 아이의 데이터를 참조합니다.
    try:
        records = list(records_collection.find().sort("date", -1).limit(5))
        records_text = "\n".join([f"{record['date']}: {record['type']} - {record.get('details', '')}" for record in records])
        
        messages = [
            {"role": "system", "content": "You are an assistant skilled in predicting baby growth and activities based on historical data. 한글로 50자 내외로 말해줘."},
            {"role": "user", "content": f"Here are the recent records:\n{records_text}\n\nBased on these records, please predict the next activity."}
        ]
        
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        prediction = completion.choices[0].message.content
        return jsonify({"prediction": prediction})
    except Exception as e:
        logging.error("Error during prediction: %s", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
