const nodemailer = require('nodemailer')

const mailInit = (cb) => {
  const transporter = nodemailer.createTransport({
    service: String(process.env.EMAIL_SENDER_PLATFORM),
    auth: {
      user: String(process.env.EMAIL_SENDER),
      pass: String(process.env.EMAIL_PW)
    }
  })
  cb(transporter)
}


module.exports = {

  sendVerification(targetEmail, fname, VerifyToken) {
    mailInit(transporter => {
      const message = {
        from: String(process.env.EMAIL_SENDER),
        to: targetEmail,
        subject: "Verify your account Hackverflow",
        text: `Hey ${fname}, let's verify your email to use Hackverflow web`,
        html: `<p><a href=${String(process.env.URL_CALLBACK_VERIFY)}/verify/${VerifyToken}> Verify your email </a></p>`
      }

      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info)
        }
      })
    })
  },
  sendWellcomeEmail(targetEmail, fname) {
    mailInit(transporter => {
      const message = {
        from: String(process.env.EMAIL_SENDER),
        to: targetEmail,
        subject: "Welcome to Hackverflow web",
        text: `Thank's ${fname} for joining on Hackverflow web)`
      }

      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info)
        }
      })
    })
  },
  sendVoucher(targetEmail, voucher) {
    mailInit(transporter => {
      const message = {
        from: String(process.env.EMAIL_SENDER),
        to: targetEmail,
        subject: "Luck to you from Us",
        text: `Thank's dear member of Hackverflor you got a voucher gift from us, use it wisely, CODE: ${voucher})`
      }

      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info)
        }
      })
    })
  }
}
