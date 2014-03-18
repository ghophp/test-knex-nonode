var Knex, Bookshelf;

$(document).ready(function() {

    Knex = require('knex')
    Bookshelf = require('bookshelf')

    Bookshelf.Db = Bookshelf.initialize({
        client: 'catalog',
            connection: {
                url: '/db/'
            }
        })

    var MyApp = new Backbone.Marionette.Application()
    
    MyApp.addRegions({
        mainRegion: '#main'
    })

    var CommentsModel = Bookshelf.Db.Model.extend({
        tableName: 'comments',
        users: function() {
            return this.belongTo(UserModel, 'id')
        }
    })

    var CommentsCollection = Bookshelf.Db.Collection.extend({
        model: CommentsModel
    })

    var UserModel = Bookshelf.Db.Model.extend({
        tableName: 'users',
        defaults: {
            name: '',
            age: 18
        },
        comments: function() {
            return this.hasMany(CommentsModel, 'user_id')
        }
    })

    var UsersCollection = Bookshelf.Db.Collection.extend({
        model: UserModel,
        findByName: function(value) {
            this.query('where', 'name', 'LIKE', '%' + value + '%')
            return this
        }
    })

    var UserView = Marionette.ItemView.extend({
        template: '#template-user',
        tagName: 'li',
        className: 'col-md-12'
    })

    var EmptyListView = Marionette.ItemView.extend({
        template: '#template-empty-list',
        tagName: 'li',
        className: 'align-center col-md-12'
    })

    var UsersView = Marionette.CompositeView.extend({
        template: '#template-users',
        itemViewContainer: 'ul',
        itemView: UserView,
        emptyView: EmptyListView
    })

    var AppLayout = Marionette.Layout.extend({
        template: '#template-layout',
        regions: {
            resultRegion: '#result'
        },

        onRender: function() {
            
            $('body').on('submit', '#form-finduser', function(e) {
                e.preventDefault();

                var users = new UsersCollection()
                    .findByName($('#name').val())
                    .fetch({
                        withRelated: ['comments']
                    })
                    .then(function(collection) {

                        console.log(collection.toJSON())
                        
                        var region = MyApp.mainRegion.currentView.resultRegion
                            usersView = new UsersView({collection: collection})

                        region.show(usersView)

                    })

            })

        }
    })
    
    MyApp.addInitializer(function(options) {
        
        var appLayout = new AppLayout()
        MyApp.mainRegion.show(appLayout)

    })

    MyApp.start()

})