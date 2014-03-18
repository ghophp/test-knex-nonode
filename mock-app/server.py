# -*- coding: utf-8 -*-

import os
import sys
import mimetypes
import cyclone.web
import sqlite3

from twisted.python import log

def run():
    mimetypes.init()
    settings = dict(
        assets_path="../data",
        template_path="../data/templates",
        debug=True,
        xheaders=True,
        xsrf_cookies=False,
        cookie_secret="TTXFxQWGVR37Tk4jq1L46KcobLz0N2"
    )

    current_path = os.getcwd()
    sys.path.append(current_path)

    settings['assets_path'] = os.path.join(current_path, settings.get('assets_path'))

    routes = [
        (r'/', MainHandler),
        (r'/db/', DbHandler),  
        (r'/static/(.*)', cyclone.web.StaticFileHandler, {'path': settings.get('assets_path')})
    ]

    application = cyclone.web.Application(routes, **settings)

    from twisted.internet import reactor

    log.startLogging(sys.stdout)
    reactor.listenTCP(8888, application)
    reactor.run()


class MainHandler(cyclone.web.RequestHandler):

    def get(self):
        self.render('index.html')


class DbHandler(cyclone.web.RequestHandler):

    def dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def post(self):

        conn = sqlite3.connect('user.sqlite3')
        conn.row_factory = self.dict_factory

        sql = self.get_argument('sql', None)
        bindings = self.request.arguments.get("bindings[]", None)
        if sql is not None:

            if bindings is not None:
                sql = sql.replace('?', '"%s"')
                sql = sql % tuple(bindings)

            print sql

            c = conn.cursor()
            c.execute(sql)
            
            result = c.fetchall()
          
            self.write(cyclone.web.escape.json_encode(result))


if __name__ == '__main__':
    run()
