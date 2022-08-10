
this.my_content = {

    init: function () {
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
                    ${renderTable(requestResult.data[0].markdown, {
                    actions: row => {
                        const idUpdate = 'x' + s4();
                        const idDelete = 'x' + s4();
                        setTimeout(() => {
                            s('.' + idUpdate).onclick = () => console.log(row);
                            s('.' + idDelete).onclick = () => {
                                console.log(row);

                                const idYes = 'x' + s4();
                                const idNo = 'x' + s4();
                                const idMoval = 'mini-modal-' + s4();

                                append('body', renderFixModal({
                                    id: idMoval,
                                    icon: '<i class="fas fa-question"></i>',
                                    color: 'yellow',
                                    content: () => {
                                        return /*html*/`
                                        ${renderLang({ es: 'Estas seguro <br> de eliminar?', en: 'Are you sure <br> to delete?' })}
                                        <br>
                                        <button class='${idYes}'>${renderLang({ es: 'Si', en: 'yes' })}</button>
                                        <button class='${idNo}'>${renderLang({ es: 'No', en: 'No' })}</button>
                                        `
                                    },
                                    time: 60000,
                                    height: 170
                                }));

                                s('.' + idYes).onclick = () => {
                                    fadeOut(s('.' + idMoval));
                                    setTimeout(() => s('.' + idMoval).remove());
                                };
                                s('.' + idNo).onclick = () => {
                                    fadeOut(s('.' + idMoval));
                                    setTimeout(() => s('.' + idMoval).remove());
                                };

                            };
                        });
                        return /*html*/`
                            <td>
                                    ${renderUpdateDeleteIcons(idUpdate, idDelete)}
                            </td>
                            `
                    }
                })
                    + renderTable(requestResult.data[0].editor, {
                        actions: row => {
                            const idUpdate = 'x' + s4();
                            const idDelete = 'x' + s4();
                            setTimeout(() => {
                                s('.' + idUpdate).onclick = () => console.log(row);
                                s('.' + idDelete).onclick = () => console.log(row);
                            });
                            return /*html*/`
                            <td>
                                    ${renderUpdateDeleteIcons(idUpdate, idDelete)}
                            </td>
                            `
                        }
                    })
                    + renderTable(requestResult.data[0]['js-demo'], {
                        actions: row => {
                            const idUpdate = 'x' + s4();
                            const idDelete = 'x' + s4();
                            setTimeout(() => {
                                s('.' + idUpdate).onclick = () => console.log(row);
                                s('.' + idDelete).onclick = () => console.log(row);
                            });
                            return /*html*/`
                            <td>
                                    ${renderUpdateDeleteIcons(idUpdate, idDelete)}
                            </td>
                            `
                        }
                    })}
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
    },
    routerDisplay: function () {
        this.renderMyContentTable();
    }

};