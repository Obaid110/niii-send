app.post("/request-short-name", async (req, res) => {
  try {
    const {
      name,
      email,
      shortName,
      purpose,
      needWebsite
    } = req.body;

    if (!name || !email || !shortName) {
      return res.status(400).json({
        success: false,
        message: "Name, email and short name are required"
      });
    }

    const cleanShortName = shortName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "");

    const response = await fetch("https://mailtree.vercel.app/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        smtp_host: process.env.SMTP_HOST,
        smtp_port: Number(process.env.SMTP_PORT),
        secure: true,
        smtp_user: process.env.SMTP_USER,
        smtp_pass: process.env.SMTP_PASS,

        from: `"NIII Short Name" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Short Name Request: ${cleanShortName}.niii.xyz`,

        html: `
          <h2>New Short Name Request</h2>

          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Short Name:</b> ${cleanShortName}.niii.xyz</p>
          <p><b>Purpose:</b> ${purpose || "Not provided"}</p>
          <p><b>Need Website & Hosting:</b> ${needWebsite ? "Yes" : "No"}</p>
        `
      })
    });

    const result = await response.json();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Mail send failed"
      });
    }

    res.json({
      success: true,
      message: "Short name request sent successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
