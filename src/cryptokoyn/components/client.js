const banner = () => /*html*/ `
    <div class='in container banner' style='${borderChar(1, 'white')}'>
        <span style='${borderChar(1, 'yellow')}'>
            KO<span class='inl' style='color: red; font-size: 50px; top: 5px; ${borderChar(1, 'white')}'>λ</span>N
            <br>
            Wallet
        </span>               
    </div>
`;

append(
  'body',
  /*html*/ `

<style>

    body {
        background: black;
        color: #cfcfcf;
        font-family: arial;
    }

    a {
        color: yellow;
        text-decoration: underline;
    }

    a:hover {
        color: white;
    }

    .banner {
        font-weight: bold;
        color: black;
        font-size: 25px;
    }
    .container {
        max-width: 1200px;
        margin: auto;
        border: 3px solid #141414;
        padding: 10px;
    }

</style>

            ${banner()}
            <div class='in container'>
                test
            </div>

`
);
