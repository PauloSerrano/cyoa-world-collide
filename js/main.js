let decisionHandler = {
    
    friendshipValue: 0,
    friendshipSpent: 0,
    characterValue: 0,
    characterSpent: 0,


    refresh: function(){
        if (document.querySelector('#traitor-choices').className == "selected" && decisionHandler.getFriendCount() < 2){
            document.querySelector('#traitor-choices').classList.toggle('selected')
            decisionHandler.friendshipSpent += decisionHandler.getOptionCost(document.querySelector('#traitor-choices'))
        }
            
        
        if (document.querySelector('#soul-link-choices').className == "selected" && decisionHandler.getFriendCount() < 1){
            document.querySelector('#soul-link-choices').classList.toggle('selected')
            decisionHandler.friendshipSpent += decisionHandler.getOptionCost(document.querySelector('#soul-link-choices'))
        }

        if (document.querySelector('#alliances-choices').className == "selected" && document.querySelector('#jule-choices').className != "selected"){
            document.querySelector('#alliances-choices').classList.toggle('selected')
        }

        let currentFriendship = decisionHandler.friendshipValue - decisionHandler.friendshipSpent
        let currentCharacter = decisionHandler.characterValue - decisionHandler.characterSpent
        let friendshipDisplay = document.querySelector('#friendship-value')
        let characterDisplay = document.querySelector('#character-value')

        friendshipDisplay.innerHTML = currentFriendship
        if (currentFriendship < 0){
            friendshipDisplay.style.color = 'red'
        }

        else{
            friendshipDisplay.style.color = 'white'
        }


        characterDisplay.innerHTML = currentCharacter
        if (currentCharacter < 0){
            characterDisplay.style.color = 'red'
        }

        else{
            characterDisplay.style.color = 'white'
        }     
    },


    setMemory: function(memory){
        // Assigns the values to the corresponding object property
        let values = decisionHandler.getMemory(memory)

        decisionHandler.friendshipValue = values[0]
        decisionHandler.characterValue = values[1]
        decisionHandler.refresh()

        // CSS
        let memories = document.querySelectorAll('#memories section div')
        for (i = 0; i < memories.length; i++){
            if (memories[i].id != memory){
                memories[i].style.opacity = '0.5'
                memories[i].style.margin = '0px'
                memories[i].style.zIndex = '1'
            }

            else{
                memories[i].style.opacity = '1'
                memories[i].style.margin = '-15px'
                memories[i].style.zIndex = '2'
                memories[i].classList.toggle('selected')
            }
        }
    },


    getMemory: function(memory){
        // Array[friendship, character]
        switch(memory){
            case 'memory-charismatic':
                return [16, 4]
            
            case 'memory-bold':
                return [4, 16]            
            
            case 'memory-good':
                return [8, 12]
            
            case 'memory-altruist':
                return [20, 0]
            
            case 'memory-adamant':
                return [0, 20]
            
            case 'memory-dependable':
                return [12, 8]
            
            default:
                console.log('Oh... this is awkward!')
                
        }
    },

    
    setTiersBuild: function(choice){
        let choiceArray = choice.parentElement.querySelectorAll('span')
        let choiceType = choice.querySelector('h4').children[0].className

        // Loops through all the choices. If any were selected before, unselects and removes it's cost
        for (i = 0; i < choiceArray.length; i++){
            if (choiceArray[i].className == 'selected'){
                let cost = decisionHandler.getOptionCost(choiceArray[i])
                choiceArray[i].classList.toggle('selected')
                switch(choiceType){
                    case 'character':
                        decisionHandler.characterSpent -= cost
                        break
                    
                    case 'friendship':
                        decisionHandler.friendshipSpent -= cost
                        break
                }
            }
            

            else if (choiceArray[i] == choice && choice.className != 'selected'){
                let cost = decisionHandler.getOptionCost(choice)
                choiceArray[i].classList.toggle('selected')
                switch(choiceType){
                    case 'character':
                        decisionHandler.characterSpent += cost
                        break
                    
                    case 'friendship':
                        decisionHandler.friendshipSpent += cost
                        break
                }
            }
        }

        decisionHandler.refresh()
    },

    
    setSingleBuild: function(choice){
        let choiceType = decisionHandler.getOptionType(choice)
        let cost = decisionHandler.getOptionCost(choice)
        if (choice.querySelectorAll('h4').length > 1){
            let friendCount = decisionHandler.getFriendCount()
            if (choice.id == 'traitor-choices' && friendCount < 2){
                alert(choice.querySelector('h4').innerText)
                return
            }

            else if (choice.id == 'soul-link-choices' && friendCount < 1){
                alert(choice.querySelector('h4').innerText)
                return
            }
        }

        if (choice.className == 'selected' && choice.parentElement.parentElement.id != 'drawbacks'){
            cost *= -1
        }

        else if (choice.className != 'selected' && choice.parentElement.parentElement.id == 'drawbacks'){
            cost *= -1
        }

        switch(choiceType){
            case 'character':
                decisionHandler.characterSpent += cost
                break
            
            case 'friendship':
                decisionHandler.friendshipSpent += cost
                break
        }

        choice.classList.toggle('selected')
        decisionHandler.refresh()
    },


    getOptionCost: function(choice){
        let optionHeader

        if (choice.querySelectorAll('h4').length == 1){
            optionHeader = choice.querySelector('h4').innerHTML
        }

        else{
            optionHeader = choice.querySelectorAll('h4')[1].innerHTML
        }

        let optionCost = optionHeader.match(/.*?(\d+)\s*(.*)/)[1]
        return parseInt(optionCost)
    },

    getOptionType: function(choice){
        choiceSection = choice.parentElement.parentElement

        if (choiceSection.id != 'drawbacks'){
            return choice.querySelector('h4').children[0].className
        }

        else if (choice.querySelectorAll('h4').length == 1){
            return choice.querySelector('h4').children[1].className
        }

        else{
            return choice.querySelectorAll('h4')[1].children[1].className
        }
    }, 

    getFriendCount: function(){
        let friendList = document.querySelectorAll('#friends section div')
        let friendCount = 0
        for (i = 0; i < friendList.length; i++){
            if (friendList[i].className == "selected"){
                friendCount++
            }
        }

        return friendCount
    },

    setFinalChoices: function(){
        let currentFriendship = decisionHandler.friendshipValue - decisionHandler.friendshipSpent
        let currentCharacter = decisionHandler.characterValue - decisionHandler.characterSpent
        if (currentFriendship < 0 || currentCharacter < 0){
            alert('Too many points spent!')
            return
        }


        toggleOverlay()
        let choices = document.querySelectorAll('.selected')
        console.log(choices)
        let choicesDisplay = document.querySelector('#overlay section section')
        while (choicesDisplay.firstChild) {
            choicesDisplay.removeChild(choicesDisplay.lastChild);
          }
        // choicesDisplay.innerHTML = ''
        
        for (i = 0; i < choices.length; i++){
            let clone
            console.log(choices[i].parentElement.parentElement.classList)
            if (choices[i].parentElement.parentElement.classList.contains('tiers')){
                clone = choices[i].parentElement.cloneNode(true)
                cloneH4 = clone.querySelector('.selected h4')
                cloneP = clone.querySelector('.selected p')
                cloneH4.style.border = '1px solid white'
                cloneH4.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
                cloneP.style.border = '1px solid white'
                cloneP.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
                
                // border: 1px solid white;
                // background-color: rgba(0, 0, 0, 0.7);
            }

            else{
                clone = choices[i].cloneNode(true)
            }

            choicesDisplay.appendChild(clone)
            
        }
    }
}


let toggleState = false

function toggleMenu(){
    let aside = document.querySelector('aside')
    let links = document.querySelector('aside ul')
    
    if (toggleState == false){
        toggleState = true
        aside.style.width = '300px'
        aside.style.opacity = '1'
        aside.style.visibility = 'visible'
        links.style.visibility = 'visible'
        links.style.opacity = '1'
    }

    else{
        toggleState = false
        aside.style.width = '0px'
        aside.style.opacity = '0'
        aside.style.visibility = 'hidden'
        links.style.visibility = 'hidden'
        links.style.opacity = '0'
    }
}

function toggleOverlay(){
    let overlay = document.querySelector('#overlay')
    overlay.classList.toggle('active')
}