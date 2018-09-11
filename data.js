var data = {
    Animals: {
        Reptiles: ["Snakes", "Turtle", "Lizard", "Crocodile", "Gecko", "Iguanids"],
        Fish: ["Guppy", "Goldfish", "Tench", "Zander", "Swordfish", "Whiting"],
        Amphibian: ["Smooth newt", "Tomato Frog", "Water Frog", "Salamander", "Golden Frog", "Sunset Frog"],
        Invetebrates: ["Silverfish", "Bedbug", "Mealworm", "Snail", "Spider", "Crab"],
        Mammals: ["Bat", "Rodent", "Bear", "Deer", "Sloth", "Ape"],
        Birds: ["Eagle", "Seagull", "Parrot", "Owl", "Crane", "Penguin"],
    },
    Food: {
        Grains: ["Barley", "Teff", "Millet", "Oatmeal", "Corn", "Quinoa"],
        Fruits: ["Apple", "Pear", "Orange", "Grapes", "Kiwi", "Durian"],
        Vegetable: ["Lettuce", "Spinach", "Cabbage", "Potato", "Onion", "Garlic"],
        Dairy: ["Ghee", "Smen", "Kefir", "Curds", "Quark", "Whey"],
        Protein: ["Eggs", "Beef", "Bacon", "Tripe", "Venison", "Mutton"],
        Oils: ["Olive", "Canola", "Flaxseed", "Avocado", "Walnut", "Sesame"],
    },
    Clothing: {
        Tops: ["T-Shirt", "Polo Shirts", "Shirts", "Flannel", "Blouse", "Dress"],
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
        Gymnastics: ["Tumbling", "Acrobatic", "Artistic", "Trampoline", "Rhythmic", "Group"],
        Water: ["Diving", "Waboba", "Kayaking", "Rafting", "Canoeing", "Surfing"],
        Dance: ["Balle", "Hi-Hop", "Contra", "Tap Dance", "Salsa", "Flamenco"],
        Mountain: ["Skiing", "Ice Climbing", "Skyrunning", "Trekking", "Canyoning", "Rock Climbing"]
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
    if(item.length > maxStrLen){
        console.log('item: ',item);
    }
    uid += 1
    id = uid
    itemToId[item] = id
    idToItem[id] = item
    var parentId = parent == null ? 0 : itemToId[parent]
    fStr += id + "," + parentId + "," + item + "\n"
}

// depth start from level 1
function recurAddition(itemList, parent, depth, maxDepth) {
    if (depth <= maxDepth) {
        for (var child in itemList) {
            addItem(child, parent)
        }
        for (var child in itemList) {
            if (itemList[child] instanceof Array) {
                for (var i = 0; i < itemList[child].length; i++) {
                    if (depth + 1 <= maxDepth) {
                        addItem(itemList[child][i], child)
                    }
                }
            } else {
                recurAddition(itemList[child], child, depth + 1, maxDepth)
            }
        }
    }
}

var fs = require('fs')
resetParams()
recurAddition(data,null,1,1)
// console.log('fStr: ',fStr);
fStr = fStr.substr(0,fStr.length-1)
fs.writeFileSync("./data/menu_depth_1.csv",fStr)

resetParams()
recurAddition(data, null, 1, 2)
// console.log('fStr: ',fStr);
fStr = fStr.substr(0,fStr.length-1)
fs.writeFileSync("./data/menu_depth_2.csv",fStr)


resetParams()
recurAddition(data, null, 1, 3)
fStr = fStr.substr(0,fStr.length-1)
fs.writeFileSync("./data/menu_depth_3.csv",fStr)
// console.log('fStr: ', fStr);