const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post("/request-short-name", async (req, res) => {
    try {
        const { name, email, shortName, purpose, needWebsite } = req.body;

        const response = await fetch("https://mailtree.vercel.app/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                smtp_host: "smtp.gmail.com",
                smtp_port: 465,
                secure: true,

                smtp_user: "motech508@gmail.com",
                smtp_pass: "",

                from: '"NIII Short Name" <motech508@gmail.com>',
                to: "motech508@gmail.com",
                replyTo: email,

                subject: `New Short Name Request: ${shortName}.niii.xyz`,

                html: `
          <h2>New Short Name Request</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Short Name:</b> ${shortName}</p>
          <p><b>Purpose:</b> ${purpose || "Not provided"}</p>
          <p><b>Need Website:</b> ${needWebsite ? "Yes" : "No"}</p>
        `
            })
        });

        const result = await response.json();
        res.json(result);

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
