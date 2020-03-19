
const endPoint = "https://www.themealdb.com/api/json/v1/1/random.php";
const container = document.querySelector('.container');






function getRandom(endPoint){
    fetch(endPoint).then((response)=>{
        return response.json();
    }).then((result)=>{
        displayResult(result);
    }).catch((err)=>{
        console.log(err);
    })
}


function displayResult(randomMeal){
    const mealObj = randomMeal.meals[0]
    const name = mealObj.strMeal;
    const mealImg = mealObj.strMealThumb;
    const instructions = mealObj.strInstructions;
    const youtube = mealObj.strYoutube;
    const ingredients = [];
    const youtubeArr = youtube.split("v=");
    const date = new Date;
    for(let i = 1; i < 20; i++){
        ingredients.push(`${mealObj["strMeasure"+i]} ${mealObj["strIngredient"+i]}`);
    }
    const filteredIngredients = ingredients.filter((item)=>{
            return item != "null null" && item != " " && item != "null" && item != " null" && item != "  ";
    })
    const mealData = {
        date:`${date.getFullYear()}.${date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1}.${date.getDate()<10?"0"+date.getDate():date.getDate()}`,
        name: name,
        mealImg: mealImg,
        instructions: instructions,
        youtube: youtubeArr[1],
        ingredients: filteredIngredients,
    }
    
    container.innerHTML = `
    <div class="card">
    <!-- Food Image Ingredients Instructions -->
    <div class="foodCard">

        <div onclick="getRandom(endPoint)" class="button randomButton">
            Get Random Recipe
        </div>

        <!--Save and Load Buttons -->
        <div class="saveAndLoadRecipe">
            <div class="button save">
                Save This Recipe
            </div>
            <div onclick="loadRecipe()" class="button load">
                Open Saved Recipes
            </div>  
        </div>

        <!-- Img and Ingredients -->
        <div class="imgIngredients">
            <div class="img card">
                <h3>${mealData.name}</h3>
                <img src="${mealData.mealImg}" alt="${mealData.name}" width="100%" height="auto" >
            </div>
            <div class="ingredients card">
                <h3>Ingredients</h3>
                <ul>
                    ${renderIngredients(mealData.ingredients)}
                </ul>
            </div>
        </div>

        <!-- Description --------->
        <div class="description card">
            <h3>Instructions</h3>
            <p style="text-align:justify">${mealData.instructions}</p>
        </div>
        </div>

        <!-- Video -->
        <div class="video card">
            <div class="videoWrapper">
                <!-- Copy & Pasted from YouTube -->
                <iframe
                    width="560"
                    height="349"
                    src="https://www.youtube.com/embed/${mealData.youtube}"
                    frameborder="0"
                    allowfullscreen="allowfullscreen"></iframe>
            </div>
        </div>
    </div>
    `;
    document.querySelector('.save').addEventListener('click',()=>{saveRecipe(mealData)},{once:true});
}

function renderIngredients(ingredients){
    return ingredients.map((item)=>{
        return `<li>${item}</li>`;
    }).join("");
}


function saveRecipe(mealData){
    if(confirm("Save this recipe?")){
        const localData =  JSON.parse(localStorage.getItem("randomRecipe"))||[];
        localData.push(mealData);
        localStorage.setItem("randomRecipe",JSON.stringify(localData));
        document.querySelector(".save").textContent = "Recipe Saved";
    }
}

function loadRecipe(){
    const localData = JSON.parse(localStorage.getItem("randomRecipe"));
    function displayRecipeList(localData){
        return localData.map((item)=>{
            return `<div onclick="displaySavedRecipe(this.dataset.name)" class="button load" data-name="${item.name}">${item.name} (${item.date})</div>`;
        }).join("");
    }


    if(!localData){
        container.innerHTML = `
            <div class="card">
                <div onclick="getRandom(endPoint)" class="button randomButton">
                    Get Random Recipe
                </div>
                <p style="text-align:center; margin-top:10px">Save some recipes first!</p>
            </div>
        `;
    }else{
        container.innerHTML = `
            <div class="card">
                <div onclick="getRandom(endPoint)" class="button randomButton" style="margin-bottom:10px">
                    Get Random Recipe
                </div>
                <div class="card" style="text-align:center">
                <h3>Saved Recipes:</h3>
                    <input onkeyup="searchRecipe(this.value)" type="text" class="searchRecipe" placeholder="Search recipe...">
                    <div class="saved">
                    ${displayRecipeList(localData)}
                    </div>
                </div>
            </div>
        `;
        
    }
}

function searchRecipe(userInput){
    const localData =  JSON.parse(localStorage.getItem("randomRecipe"))||[];
    const filteredRecipe = localData.filter((item)=>{
        return item.name.toLowerCase().includes(userInput.toLowerCase());
    });
    document.querySelector(".saved").innerHTML = filteredRecipe.map((item)=>{
        return `<div onclick="displaySavedRecipe(this.dataset.name)" class="button load" data-name="${item.name}" >${item.name} (${item.date})</div>`;
    }).join("");
}

function displaySavedRecipe(name){
    const localData =  JSON.parse(localStorage.getItem("randomRecipe"))||[];
    const mealData = localData.filter((item)=>{
        return item.name === name;
    })

    container.innerHTML = `
    <div class="card">
    <!-- Food Image Ingredients Instructions -->
    <div class="foodCard">

        <div onclick="getRandom(endPoint)" class="button randomButton">
            Get Random Recipe
        </div>

        <!--Delete and Load Buttons -->
            <div onclick="loadRecipe()" class="button load">
                Open Saved Recipes
            </div>  
            <div onclick="deleteRecipe(this.dataset.name)" data-name="${mealData[0].name}" class="button delete">
                Delete This Recipes
            </div>  
      
        <!-- Img and Ingredients -->
        <div class="imgIngredients">
            <div class="img card">
                <h3>${mealData[0].name}</h3>
                <img src="${mealData[0].mealImg}" alt="${mealData[0].name}" width="100%" height="auto" >
            </div>
            <div class="ingredients card">
                <h3>Ingredients</h3>
                <ul>
                    ${renderIngredients(mealData[0].ingredients)}
                </ul>
            </div>
        </div>

        <!-- Description --------->
        <div class="description card">
            <h3>Instructions</h3>
            <p style="text-align:justify">${mealData[0].instructions}</p>
        </div>
        </div>

        <!-- Video -->
        <div class="video card">
            <div class="videoWrapper">
                <!-- Copy & Pasted from YouTube -->
                <iframe
                    width="560"
                    height="349"
                    src="https://www.youtube.com/embed/${mealData[0].youtube}"
                    frameborder="0"
                    allowfullscreen="allowfullscreen"></iframe>
            </div>
        </div>
    </div>
    `;
}

function deleteRecipe(name){
    if(confirm(`Delete ${name} from saved recipes?`)){
        const localData =  JSON.parse(localStorage.getItem("randomRecipe"));
        const index = localData.findIndex((item)=>{
            return item.name === name;
        })
        localData.splice(index,1);
        localStorage.setItem("randomRecipe",JSON.stringify(localData));
        loadRecipe();
    }
    
}

getRandom(endPoint);


