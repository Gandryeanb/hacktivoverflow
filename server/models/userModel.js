const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  avatar: {
    type: String
  },
  fname: {
    type: String,
    required: [true, 'fname required'],
    validate: {
      validator() {
        if (this.fname.length < 3) {
          throw new Error('First name length must be greater than 2')
        }
        let patt = new RegExp(/\d/)
        if (patt.test(this.fname)) {
          throw new Error('First name must be contained with characther only')
        }
      }
    }
  },
  lname: {
    type: String,
    validate: {
      validator() {
        if (this.lname.length !== 0) {
          let patt = new RegExp(/\d/)
          if (patt.test(this.lname)) {
            throw new Error('Last name must be contained with characther only')
          }
          if (this.lname.length < 3) {
            throw new Error('Last name length must be greater than 2')
          }
        }
      }
    }
  },
  verified: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email required'],
    validate: {
      validator() {
        let patt = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)
        if (!patt.test(this.email)) {
          throw new Error('Email is invalid')
        }
      }
    }
  },
  password: {
    type: String,
    required: [true, 'password required'],
    validate: {
      validator() {
        if (this.password.length < 6) {
          throw new Error('Password length must be greater than 5')
        }
        let patt = new RegExp(/[^a-zA-Z0-9]/)
        if (patt.test(this.password)) {
          throw new Error('Password is combination beetween number and char')
        }
        patt = new RegExp(/[a-zA-Z]/)
        if (patt.test(this.password)) {

          patt = new RegExp(/[0-9]/)
          if (!patt.test(this.password)) {
            throw new Error('Password is combination beetween number and char')
          }

        } else {
          throw new Error('Password is combination beetween number and char')
        }
      }
    }
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  reputation: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: 'user'
  },
  loginWeb: {
    type: Number,
    default: 1
  },
  loginGoogle: {
    type: Number,
    default: 0
  }
});

userSchema.post('validate', doc => {
  let hash = bcrypt.hashSync(doc.password, Number(process.env.HASH_PASSWORD));
  doc.password = hash
  let num = Math.floor(Math.random() * 500)
  doc.avatar = `https://rickandmortyapi.com/api/character/avatar/${num}.jpeg`
})

const User = mongoose.model('User', userSchema);

module.exports = User
