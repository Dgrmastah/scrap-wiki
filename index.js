const axios = require('axios')
const cheerio = require('cheerio')  
const express = require('express')
const app = express()  

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap' 

app.get('/', (req, res) => {
    axios.get(url).then((response)=> {
        if(response.status === 200) {
            const html =response.data
            const $ = cheerio.load(html)

            const pageTitle = $('title').text()
            const links = []
            const imgs = []
            const pageText = $('p').text()

            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href');
                if (link && link.startsWith('/wiki/')) {
                    links.push('https://es.wikipedia.org' + link); 
                }
            });
            console.log(links);

            $('img').each((index, element) => {
                const img = $(element).attr('src')
                imgs.push(img)
            })
            console.log(imgs);

            res.send(`
                <h1>${pageTitle}</h1>
                <h2>${pageText}</h2>
                <ul>
                    ${links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
                </ul>
                <ul>
                    ${imgs.map(img => `<li>${img}</li>`).join('')}
                </ul>
            `)
        }
    })
})

app.listen(3000, () => {
    console.log('servidor corriendo en el puerto http://localhost:3000')
})
