
this.my_content = {

    init: function () {

        setTimeout(() => this.renderMyContentTable());

        return /*html*/`
            <table-my-content></table-my-content>
        `
    },
    renderMyContentTable: async () => {
        const requestResult = await serviceRequest(() => '/api/uploader', {
            headers: {
                'Authorization': renderAuthBearer()
            }
        });

        console.log('request', requestResult);

        if (requestResult.status == 'success') {
            if (requestResult.data[0]) {
                htmls('table-my-content',
                    /*html*/`
                  <div class='in container'> 
                    ${renderTable(requestResult.data[0].markdown)
                    + renderTable(requestResult.data[0].editor)
                    + renderTable(requestResult.data[0]['js-demo'])}
                    </div> `
                );
            }
            // append('body', renderFixModal({
            //     id: 'mini-modal-' + s4(),
            //     icon: sucessIcon,
            //     color: 'green',
            //     content: renderLang({ es: 'Contenido Obtenido', en: 'Obtained content' })
            // }));
        } else {
            // append('body', renderFixModal({
            //     id: 'mini-modal-' + s4(),
            //     icon: errorIcon,
            //     color: 'red',
            //     content: requestResult.data
            // }));
        }
    }

};