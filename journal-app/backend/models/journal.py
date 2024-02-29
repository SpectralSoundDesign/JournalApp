from database import db

class Journal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    entries = db.relationship('Entry', backref='journal', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'), # '2021-01-01 12:00:00 
            'entries': [entry.to_dict() for entry in self.entries] if self.entries else []
            # ... any other fields ...
        }

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())   
    journal_id = db.Column(db.Integer, db.ForeignKey('journal.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'), # '2021-01-01 12:00:00 
            'journal_id': self.journal_id,
            # ... any other fields ...
        }
