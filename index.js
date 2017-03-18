let http = require('http')
let cheerio = require('cheerio')
let request = require('request')

let url = 'http://www.preston.se/dagens.html'

function menuFor(name, dishes) {
    return {
        restaurant: name,
        dishes: dishes
    }
}

function dishes($, index) {
    let dishes = []
    let h = $('#place' + index + ' a ol li').each(function(i, elem) {
        dishes.push($(this).text())
    })
    return dishes
}

function isRestaurant(item) {
    return item.children[0].attribs && 'husman collegium chili'.indexOf(item.children[0].attribs.id) >= 0
}

const server = http.createServer()
server.on('request', function(req, resp) {
    request(url, function(error, response, html) {
        if (!error) {
            let $ = cheerio.load(html) // ('#supportingText div').toArray().filter(isRestaurant).map(createMenu)
            let menus = [
                menuFor('Husman', dishes($, 0)),
                menuFor('Chili', dishes($, 1)),
                menuFor('Collegium', dishes($, 2))
            ]
            resp.setHeader('Access-Control-Allow-Origin', '*')
            resp.setHeader('Content-Type', 'application/json')
            resp.write(JSON.stringify(menus, null, 2))
            resp.end()
        }
    })
})
server.listen(8089)