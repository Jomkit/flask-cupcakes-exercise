const BASE_URL = '/api/cupcakes'
class Cupcake {
    constructor(flavor, size, rating, image){
        this.flavor = flavor;
        this.size = size;
        this.rating = rating;
        this.image = image;
    }
}

async function listAllCupcakes(){
    const resp = await axios.get(BASE_URL);
    const cupcakes = resp.data['cupcakes'];

    for(i=0; i<=cupcakes.length;i++){
        let cupcake = resp.data['cupcakes'][i];
        $("ul").append(`<li class='list-group-item' id="${cupcake['id']}">${cupcake['flavor']}</li>`);
    }
    
    return resp;
}

listAllCupcakes();

$('ul').click(eventHandler)

async function eventHandler(evt){

    // click on cupcake to get cupcake info
    if(evt.target){
        const cup_id = evt.target.id;
        const resp = await axios.get(`${BASE_URL}/${cup_id}`);
        return alert(`${resp.data.cupcake['flavor']} cupcake, ${resp.data.cupcake['size']}`);
    }
}

// Handle Form submission
$('#cupcake-add-form').on('submit', addCupcakeForm);

async function addCupcakeForm(e){
    e.preventDefault();
    const cupcakeData = $('.form-control');

    let serialized = {};
    for(let i in cupcakeData){
        serialized[cupcakeData[i]['name']] = cupcakeData[i]['value'];
    }
    let resp = await axios.post(BASE_URL, serialized);
    $('ul').append(`<li class='list-group-item' id="${serialized['id']}">${serialized['flavor']}</li>`)

    return resp;
}