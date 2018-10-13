MENU_TYPE_STR = "Menu Type"
MENU_BREADTH_STR = "Menu Breadth"
PARTICIPANT_ID_STR = "Participant ID"
MENU_DEPTH_STR = "Menu Depth"
// TARGET_ITEM = "TARGET_ITEM",Target Item
var fs = require('fs')

var trialMax = 3

var mainHeading = ["Menu Type", "Menu Breadth", "Menu Depth"]

var typeArr = [
    ["Radial", "Marking"],
    ["Marking", "Radial"],
]

// Keys breadth+Depth
var targetItem = {
    121: "Animals",
    221: "Food",
    321: "Animals",

    122: "Fruits",
    222: "Birds",
    322: "Reptiles",

    123: "Apple",
    223: "Barley",
    323: "Eagle",


    141: "Food",
    241: "Animals",
    341: "Education",

    142: "Fruits",
    242: "Math",
    342: "Grains",

    143: "Jeans",
    243: "Shirts",
    343: "Eagle",

    161: "Sports",
    261: "Animals",
    361: "Food",

    162: "China",
    262: "Fish",
    362: "India",

    163: "Cap",
    263: "Sneakers",
    363: "Ape",
}


var breadthArr = [
    // [2, 4, 6],
    // [4, 6, 2],
    // [6, 2, 4]
    [4,6]
]

var depthArr = [1, 2, 3]

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function ordering() {
    var content = []
    typeArr.forEach(typeItem => {
        breadthArr.forEach(breadthItem => {
            pushable = []
            newType = clone(typeItem)
            newBreadth = clone(breadthItem)
            // newBreadth.forEach(bItem => {
            //     newType.push(bItem)
            // })
            // depthArr.forEach(dItem => {
            //     newType.push(dItem)
            // })
            newDepth = clone(depthArr)
            pushable.push(newType)
            pushable.push(newBreadth)
            pushable.push(newDepth)
            content.push(pushable)
        })

    })
    console.log('content: ', content);
    return content
}

function saveOrdering(content) {
    newHeading = clone(mainHeading)
    newHeading.splice(0, 0, "Ordering")
    orderNum = 1
    arrangementArr = []
    content.forEach(arrangement => {
        cArr = [orderNum]
        orderNum += 1
        arrangement.forEach(iv => {
            iv.forEach(element => {
                cArr.push(element)
            })
        })
        arrangementArr.push(cArr.join(','))
    })
    arrangementArr.splice(0, 0, newHeading)
    finalStr = arrangementArr.join('\n')
    // console.log('finalStr: ',finalStr);
    fs.writeFileSync('./otherData/arrangement.csv', finalStr)
}

function participantArrangement(content) {
    newHeading = clone(mainHeading)
    newHeading.splice(0, 0, "Ordering")
    newHeading.splice(0, 0, "Condition")
    console.log('newHeading: ', newHeading);
    orderNum = 1
    combinedArr = []
    content.forEach(arrangement => {
        arrangementArr = []
        iv1 = arrangement[0]
        iv2 = arrangement[1]
        iv3 = arrangement[2]
        conditionCounter = 1
        for (var i = 0; i < iv1.length; i++) {
            for (var j = 0; j < iv2.length; j++) {
                for (var k = 0; k < iv3.length; k++) {
                    for (var trialNum = 1; trialNum <= 3; trialNum++) {
                        tempArr = []
                        tempArr.push(trialNum)
                        tempArr.push(conditionCounter); tempArr.push(orderNum);
                        tempArr.push(iv1[i]); tempArr.push(iv2[j]); tempArr.push(iv3[k])
                        combinedArr.push(clone(tempArr).join(','))
                        // Added target item here
                        newTempArr = clone(tempArr)
                        newTempArr.push(targetItem[trialNum+""+iv2[j] + "" + iv3[k]])
                        arrangementArr.push(clone(newTempArr).join(','))
                    }
                    conditionCounter += 1
                }
            }
        }
        // Add targeted heading
        targetHeading = clone(newHeading)
        targetHeading.push("Target Item")
        targetHeading.unshift("Trial Number")
        arrangementArr.splice(0, 0, targetHeading)
        fs.writeFileSync("./data/experiments" + orderNum + ".csv", arrangementArr.join('\n'))
        orderNum += 1
        // arrangementArr.push(cArr.join(','))
    })
    conditionJson = {
        heading: newHeading,
        condition: clone(combinedArr)
    }
    combinedArr.splice(0, 0, newHeading)
    finalStr = combinedArr.join('\n')
    // console.log('finalStr: ',finalStr);
    // fs.writeFileSync('./otherData/condition.csv', finalStr)
    return conditionJson
}

function saveTrial(conditionJson) {
    combinedArr = clone(conditionJson.condition)
    newHeading = clone(conditionJson.heading)
    trialArr = []
    combinedArr.forEach(arrangementStr => {
        for (var i = 0; i < trialMax; i++) {
            var count = i + 1
            trialArr.push(count + ',' + arrangementStr)
        }
    })
    newHeading.splice(0, 0, 'Trial Number')
    trialArr.splice(0, 0, newHeading.join(','))
    fs.writeFileSync('./otherData/trial.csv', trialArr.join('\n'))
}

content = ordering()

saveOrdering(content)

cJson = participantArrangement(content)

// saveTrial(cJson)