from flask import Flask, render_template, request, redirect, url_for
import sqlite3 as sql
import sys
from pathlib import Path
import json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

conn = None
cursor = None

try:
    path = Path(__file__).parent.absolute()
    conn = sql.connect(str(path) + '\\database.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM markers")
    print(cursor.fetchone())

except sql.Error as e:
    print(e)
    sys.exit(1)

conn.close()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)


class ArticlePost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    subtitle = db.Column(db.String(50))
    author = db.Column(db.String(20))
    date_posted = db.Column(db.DateTime)
    content = db.Column(db.Text)


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/collaborative_information', methods=['GET', 'POST'])
def collaborative_information():
    return render_template("collaborative_information.html")


@app.route('/api/save/', methods=['GET', 'POST'])
def save_to_db():
    city_name = request.args.get('city_name')
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    status = request.args.get('status')

    try:
        path = Path(__file__).parent.absolute()
        conn = sql.connect(str(path) + '\\database.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO markers ('lat', 'lng','administrative','status') VALUES ('{}','{}','{}','{}');".format(lat,
                                                                                                                lng,
                                                                                                                city_name,
                                                                                                                status))
        conn.commit()
    except sql.Error as e:
        print(e)
        sys.exit(1)

    conn.close()

    return_dict = {}
    return (return_dict)


@app.route('/api/report', methods=['POST'])
def test():
    data = request.form
    try:
        path = Path(__file__).parent.absolute()
        conn = sql.connect(str(path) + '\\database.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO events (city_name, event_title, event_description, event_type, date) VALUES ('{}','{}','{}',"
            "'{}', DATE())".format(data['city_name'], data['event_name'], data['event_description'],
                                   data['event_type']))
        cursor.execute(
            "INSERT INTO markers (lat, lng, administrative, status, date) VALUES ('{}','{}','{}',"
            "'{}', DATE())".format(data['lat'], data['lng'], data['city_name'],
                                   data['event_type']))
        conn.commit()
        conn.close()

    except sql.Error as e:
        print(e)
    return '', 204


@app.route('/api/retrieve/', methods=['GET', 'POST'])
def request_all_data():
    try:
        path = Path(__file__).parent.absolute()
        conn = sql.connect(str(path) + '\\database.db')
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM markers")
        data = cursor.fetchall()
        export = json.dumps(data)
        conn.close()
        return export

    except sql.Error as e:
        print(e)


@app.route('/api/retrieve/events/', methods=['GET', 'POST'])
def request_city_name():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    try:
        path = Path(__file__).parent.absolute()
        conn = sql.connect(str(path) + '\\database.db')
        cursor = conn.cursor()
        cursor.execute(
            "SELECT administrative FROM 'markers' WHERE lat='{}' AND lng='{}'".format(lat, lng))
        data = cursor.fetchone()
        export = json.dumps(data)
        conn.close()
        return export

    except sql.Error as e:
        print(e)


@app.route('/api/retrieve/events/city/', methods=['GET'])
def request_all_events_in_city():
    city_name = request.args.get('city_name')
    return_dict = {}
    try:
        path = Path(__file__).parent.absolute()
        conn = sql.connect(str(path) + '\\database.db')
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM 'events' WHERE city_name='{}'".format(city_name))
        data = cursor.fetchall()
        export = json.dumps(data)
        conn.close()
        return export

    except sql.Error as e:
        print(e)


########

@app.route('/articles')
def articles():
    posts = ArticlePost.query.order_by(ArticlePost.date_posted.desc()).all()

    return render_template('articles.html', posts=posts)


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/post/<int:post_id>')
def post(post_id):
    post = ArticlePost.query.filter_by(id=post_id).one()

    return render_template('post.html', post=post)


@app.route('/add')
def add():
    return render_template('add.html')


@app.route('/addpost', methods=['POST'])
def addpost():
    title = request.form['title']
    subtitle = request.form['subtitle']
    author = request.form['author']
    content = request.form['content']

    post = ArticlePost(title=title, subtitle=subtitle, author=author, content=content, date_posted=datetime.now())

    db.session.add(post)
    db.session.commit()

    return redirect(url_for('articles'))


@app.route('/contact_us')
def contact_us():
    return render_template('contact_us.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
