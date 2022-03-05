//created model i.e the table 
const {Sequelize, DataTypes } = require('@sequelize/core');
const db = require('../config/database');//defination of your orm

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')

const User = db.define('User', {//use db to create your table=> User is the table name.
    id: {
        type: DataTypes.STRING,
        defaultValue:uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password: {
        type:DataTypes.STRING,
        allowNull: false,
        },
},{
    timestamps: true,
    freezeTableName:true,//duplicates table in changed later*
    underscored:true,            
});

//hash password before saving
User.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
});

User.prototype.validate=function(password){
    return bcrypt.compare(password.toString(),this.password.toString())
} 

//sync to table/->force not working as expected.* User.sync()
//db.sync-> syncs all the tabels

const Todo = db.define('Todo', {//use db to create your table=> User is the table name.
    id:{
        type: DataTypes.STRING,
        defaultValue:uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    todo:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName:true,//duplicates table in changed later*
    underscored:true,            
});

User.hasMany(Todo,{onDelete:'CASCADE'})


db.sync({alter:true})
.then((data)=>{
    console.log('synced')})
.catch((err)=>{console.log('error syncing',err)})

module.exports = {User,Todo};

