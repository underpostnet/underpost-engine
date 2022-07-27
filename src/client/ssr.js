'use strict';

import fs from 'fs';
import express from 'express';
import parser from 'ua-parser-js';
import UglifyJS from 'uglify-js';
import CleanCSS from 'clean-css';
import { commonFunctions } from '../api/util.js';
import { logger } from '../modules/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const cssClientCore = `html{scroll-behavior:smooth}.fl{position:relative;display:flow-root}.abs,.in{display:block}.fll{float:left}.flr{float:right}.abs{position:absolute}.in,.inl{position:relative}.inl{display:inline-table}.fix{position:fixed;display:block}.center{transform:translate(-50%,-50%);top:50%;left:50%;width:100%;text-align:center}`;


const renderView = dataView => {
    const { view, viewMetaData, viewPaths } = dataView;
    let jsClientCore = `(function(){
        ${commonFunctions()}
        ${fs.readFileSync('./src/client/lib.js', viewMetaData.charset)}
        const viewPaths = JSON.parse('${JSON.stringify(viewPaths.filter(path => path.render))}');
        const view = JSON.parse('${JSON.stringify(view)}');
        const viewMetaData = JSON.parse('${JSON.stringify(viewMetaData)}');
        const maxIdComponent = 50;
        const errorIcon = ${/*html*/"`<i class='fa fa-exclamation-triangle' aria-hidden='true'></i>`"};
        const sucessIcon = ${/*html*/"`<i class='fa fa-check-circle' aria-hidden='true'></i>`"};
        
        const dev =  ${process.env.NODE_ENV != 'development' ? 'false' : 'true'};
        if(!dev){
            console.log = () => null;
            console.error = () => null;
            console.warn = () => null;
        }
        
        console.log('dataView', view);
        ${fs.readFileSync(viewMetaData.router, viewMetaData.charset)}
        ${fs.readFileSync('./src/client/router.js', viewMetaData.charset)}
    })()`;
    if (process.env.NODE_ENV != 'development') jsClientCore = UglifyJS.minify(jsClientCore).code;
    return /*html*/`
    <!DOCTYPE html>
    <html dir='${viewMetaData.dir}' lang='${viewMetaData.lang}'>
        <head>
            <meta charset='${viewMetaData.charset}'>
            <title> ${view.title[viewMetaData.lang] != '' ? view.title[viewMetaData.lang] + ' - ' : ''}${viewMetaData.mainTitle} </title>
            <link rel='icon' type='${viewMetaData.favicon.type}' href='${viewMetaData.favicon.path}'>
            <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
            <style>
                ${new CleanCSS().minify(cssClientCore
        + viewMetaData.styles.map(dirStyle => fs.readFileSync(dirStyle, viewMetaData.charset)).join('')
        + viewPaths.filter(path => path.render).map(path => path.component + `{ display: none; }`).join('')
    ).styles}
            </style>
            <link rel='stylesheet' href='/fontawesome/all.min.css'>
            <!-- Script element sourcing TinyMCE -->
            <script type='application/javascript' src= '/tinymce/tinymce.min.js'></script>
            <link rel='stylesheet' href='/simplemde/simplemde.min.css'>
            <script src='/simplemde/simplemde.min.js'></script>
            <script src='/marked/marked.min.js'></script>

            <link rel='stylesheet' href='/spectre-markdown.css/dist/markdown.min.css'>
        </head>
        <body>                  
            <script>
                ${process.env.NODE_ENV == 'development' ? jsClientCore : UglifyJS.minify(jsClientCore).code}
            </script>
        </body>
    </html>

`;
};

const ssr = (app, renderData) => {

    const { viewPaths } = renderData;

    app.use('/assets', express.static(`./src/client/assets`));
    app.use('/.well-known', express.static(`./src/client/.well-known`));
    app.use('/fontawesome', express.static(`./node_modules/@fortawesome/fontawesome-free/css`));
    app.use('/webfonts', express.static(`./node_modules/@fortawesome/fontawesome-free/webfonts`));
    app.use('/tinymce', express.static('./node_modules/tinymce'));
    app.use('/simplemde', express.static('./node_modules/simplemde/dist'));
    app.use('/marked', express.static('./node_modules/marked'));
    app.use('/spectre-markdown.css', express.static('./node_modules/spectre-markdown.css'));

    const renders = viewPaths.filter(view => view.render).map(view => {
        return {
            path: view.path,
            render: renderView({
                view,
                ...renderData
            })
        };
    });

    renders.map(view => app.get(view.path,
        (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            logger.info(parser(req.headers['user-agent']));
            return res.status(200).end(view.render);
        }));

};

export {
    ssr,
    cssClientCore,
    renderView
};