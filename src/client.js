


append('body', /*html*/`
    <style>
        ${/*css*/`
            html {
                background: black;
                color: white;
            }
        `}
    </style>
`)

append('body', 'Hello World! <br> URI:' + getURI());