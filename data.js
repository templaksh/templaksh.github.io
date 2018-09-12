var data = {
    Animals: {
        Birds: ["Eagle", "Seagull", "Parrot", "Owl", "Crane", "Penguin"],
        Reptiles: ["Snakes", "Turtle", "Lizard", "Crocodile", "Gecko", "Iguanids"],
        Fish: ["Guppy", "Goldfish", "Tench", "Zander", "Swordfish", "Whiting"],
        // Amphibian: ["Smooth newt", "Tomato Frog", "Water Frog", "Salamander", "Golden Frog", "Sunset Frog"],
        // Invetebrates: ["Silverfish", "Bedbug", "Mealworm", "Snail", "Spider", "Crab"],
        Amphibian: ["Newt", "Frog", "Caecilian", "Salamander", "Blindworm", "Toad"],
        Arthropod: ["Crab", "Butterfly", "Scorpion", "Mites", "Lobster", "Shrimp"],
        Mammals: ["Bat", "Rodent", "Bear", "Deer", "Sloth", "Ape"],
    },
    Food: {
        Grains: ["Barley", "Teff", "Millet", "Oatmeal", "Corn", "Quinoa"],
        Fruits: ["Apple", "Pear", "Orange", "Grapes", "Kiwi", "Durian"],
        Vegetable: ["Lettuce", "Spinach", "Cabbage", "Potato", "Onion", "Garlic"],
        Dairy: ["Ghee", "Smen", "Kefir", "Curds", "Quark", "Whey"],
        Protein: ["Eggs", "Beef", "Bacon", "Tripe", "Venison", "Mutton"],
        Oils: ["Olive", "Canola", "Flaxseed", "Avocado", "Walnut", "Sesame"],
    },
    Education: {
        Chemistry: ["Kasha", "Lamm", "Langmuir", "Nernst", "Ostwald", "Raoult"],
        Physics: ["Ampere", "Birch", "Gauss", "Byerlee", "Coulomb", "Curie"],
        Math: ["Benford", "Dirac", "Godel", "Hilbert", "Peano", "Niven"],
        Economics: ["Keynesian", "Marxism", "Solow", "Laffer", "Auctions", "Rubinomic"],
        Biology: ["Darwin", "Gene", "Cell", "Nucleus", "Neuron", "Ganglion"],
        Geography: ["Hydrology", "Pedology", "Glacial", "Waterfall", "Erosion", "Pollution"],
    },
    Clothing: {
        Tops: ["T-Shirt", "Henley", "Shirts", "Flannel", "Blouse", "Dress"],
        Bottoms: ["Jeans", "Leggings", "Tights", "Skirts", "Pants", "Shorts"],
        Outerwear: ["Coat", "Jacket", "Sweaters", "Cardigans", "Blousons", "Parka"],
        Shoes: ["Sneakers", "Boat Shoe", "Brogues", "Sandals", "Chukka", "Slip-Ons"],
        Innerwear: ["Boxers", "Briefs", "Trunks", "Bra", "Bikini", "Socks"],
        Hats: ["Beanie", "Cap", "Bowler", "Boater", "Sombrero", "Beret"]
    },
    Locations: {
        USA: ["Chicago", "Boston", "Seattle", "Austin", "Miami", "Dallas"],
        // England:[],
        Russia: ["Moscow", "Kazan", "Omsk", "Ufa", "Sochi", "Tomsk"],
        China: ["Beijing", "Shenzhen", "Hangzhou", "Chengdu", "Harbin", "Suzhou"],
        India: ["Mumbai", "Pune", "Kolkata", "Chennai", "Lucknow", "Jaipur"],
        Spain: ["Valencia", "Madrid", "Granada", "Malaga", "Bilbao", "Toledo"],
        Brazil: ["Natal", "Olinda", "Campinas", "Manaus", "Londrina", "Sorocaba"],
    },
    Sports: {
        Games: ["Football", "Hockey", "Soccer", "Basketball", "Netball", "Cricket"],
        Athletics: ["Shot Put", "Javelin", "Discus", "Sprints", "Relays", "Hurdles"],
        Gymnastic: ["Tumbling", "Acrobatic", "Artistic", "Trampoline", "Rhythmic", "Group"],
        Water: ["Diving", "Waboba", "Kayaking", "Rafting", "Canoeing", "Surfing"],
        Dance: ["Balle", "Hi-Hop", "Contra", "Tap Dance", "Salsa", "Flamenco"],
        // Mountain: ["Skiing", "Ice Climbing", "Skyrunning", "Trekking", "Canyoning", "Rock Climbing"]
        Fighting: ["MMA", "Karate", "Taekwondo", "Jijitsu", "Silat", "Boxing"]
    },

}

// var maxStrLen = 10 //"Vegetables"
var maxStrLen = 9 //"Continent"
// var maxStrLen = 13 //"Rock Climbing"
var itemToId = {}
var idToItem = {}
var uid = 0
var fStr = "Id,Parent,Label\n"

function resetParams() {
    itemToId = {}
    idToItem = {}
    uid = 0
    fStr = "Id,Parent,Label\n"
}

function addItem(item, parent) {
    if (item.length > maxStrLen) {
        console.log('item: ', item);
    }
    uid += 1
    id = uid
    itemToId[item] = id
    idToItem[id] = item
    var parentId = parent == null ? 0 : itemToId[parent]
    fStr += id + "," + parentId + "," + item + "\n"
}

// depth start from level 1
function recurAddition(itemList, parent, depth, maxDepth, maxWidth) {
    if (depth <= maxDepth) {
        var lvl1Width = 1
        for (var child in itemList) {
            if (lvl1Width <= maxWidth) {
                addItem(child, parent)
                lvl1Width += 1
            }
        }
        var lvl1Width = 1
        for (var child in itemList) {
            if (lvl1Width <= maxWidth) {
                lvl1Width+=1
                if (itemList[child] instanceof Array) {
                    var lvl2Width = 1
                    for (var i = 0; i < itemList[child].length; i++) {
                        if (depth + 1 <= maxDepth) {
                            if (lvl2Width <= maxWidth) {
                                addItem(itemList[child][i], child)
                                lvl2Width += 1
                            }
                        }
                    }
                } else {
                    recurAddition(itemList[child], child, depth + 1, maxDepth, maxWidth)
                }
            }
        }
    }
}

var fs = require('fs')
// breadth+depth
var configList = [
    [2, 1],
    [2, 2],
    [2, 3],
    [4, 1],
    [4, 2],
    [4, 3],
    [6, 1],
    [6, 2],
    [6, 3],
]
function genFiles(configBreadth, configDepth) {
    resetParams()
    recurAddition(data, null, 1, configDepth, configBreadth)
    // console.log('fStr: ',fStr);
    fStr = fStr.substr(0, fStr.length - 1)
    fs.writeFileSync("./data/menu" + configBreadth + "_" + configDepth + ".csv", fStr)
}
configList.forEach(config => {
    genFiles(config[0], config[1])
})
// resetParams()
// recurAddition(data, null, 1, 2)
// // console.log('fStr: ',fStr);
// fStr = fStr.substr(0, fStr.length - 1)
// fs.writeFileSync("./data/menu_depth_2.csv", fStr)


// resetParams()
// recurAddition(data, null, 1, 3)
// fStr = fStr.substr(0, fStr.length - 1)
// fs.writeFileSync("./data/menu_depth_3.csv", fStr)
// // console.log('fStr: ', fStr);