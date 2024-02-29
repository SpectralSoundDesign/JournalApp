from flask import Flask
from flask import request, jsonify
from models.journal import Journal, Entry
from database import setup_db, db

app = Flask(__name__)
setup_db(app, 'sqlite:///journals.db')

@app.route('/journals', methods=['GET', 'POST'], endpoint='manage_journals')
def manage_journals():
    print("Request method: ", request.method)
    if request.method == 'GET':
        journals = Journal.query.all()
        return jsonify([journal.to_dict() for journal in journals])
    else:
        new_journal = Journal(name=request.json['name'], description=request.json['description'])
        db.session.add(new_journal)
        db.session.commit()
        return jsonify(new_journal.to_dict()), 201
    
@app.route('/journals/<int:journal_id>', methods=['DELETE'])
def delete_journal(journal_id):
    journal = Journal.query.get(journal_id)
    if journal:
        entries = Entry.query.filter_by(journal_id=journal_id).all()
        for entry in entries:
            db.session.delete(entry)
        db.session.delete(journal)
        db.session.commit()
        return jsonify({'message': 'Journal and entries deleted successfully'})
    else:
        return jsonify({'message': 'Journal not found'}), 404
    
@app.route('/journals/<int:journal_id>/entries', methods=['GET', 'POST'])
def manage_entries(journal_id):
    if request.method == 'GET':
        entries = Entry.query.filter_by(journal_id=journal_id)
        return jsonify([entry.to_dict() for entry in entries])
    else:
        new_entry = Entry(text=request.json['text'], journal_id=journal_id)
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.to_dict()), 201
    
@app.route('/journals/<int:journal_id>/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(journal_id, entry_id):
    entry = Entry.query.filter_by(journal_id=journal_id, id=entry_id).first()
    if entry:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'Entry deleted successfully'})
    else:
        return jsonify({'message': 'Entry not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)