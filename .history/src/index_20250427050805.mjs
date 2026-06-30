


serve({
  port: 3000,
  fetch: (req) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>
            TogetherJS Framework Test
          </title>
        </head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <body>
          ${render_UserProfile({ userId: 123 })}
    `
  }
});