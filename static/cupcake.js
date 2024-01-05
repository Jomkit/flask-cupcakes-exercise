// function modal(){
//     const myModal = document.getElementById('myModal');
//     const myInput = document.getElementById('myInput');

//     myModal.addEventListener('shown.bs.modal', () => {
//     myInput.focus();
//     });    
// }



const BASE_URL = '/api/cupcakes';
class Cupcake {
    constructor(flavor, size, rating, image){
        this.flavor = flavor;
        this.size = size;
        this.rating = rating;
        this.image = image;
    }
}

function cupcakeDetails(cupcake){
    let html = `<li class='list-group-item' id="${cupcake['id']}"><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#cupcakeModal">${cupcake['flavor']}</button></li>`;

    return html;
}

async function listAllCupcakes(){
    const resp = await axios.get(BASE_URL);
    const cupcakes = resp.data['cupcakes'];

    for(i=0; i<=cupcakes.length; i++){
        let cupcake = resp.data['cupcakes'][i];
        let html = cupcakeDetails(cupcake);
        $("ul").append(html);
    }
    
    return resp;
}

listAllCupcakes();

$('ul').click(eventHandler);

async function eventHandler(evt){

    // click on cupcake to get cupcake info from modal, rewriting 
    // html to provide image, and cupcake details on the modal
    if(evt.target.tagName == 'BUTTON'){
        let cup_id = evt.target.parentNode.id;
        let resp = await axios.get(`${BASE_URL}/${cup_id}`);
        let cupcake = resp.data.cupcake;

        $('.modal-title').html(`<h2 class="display-4">Cupcake Details</h2>`);
        $('.cupcake-img').html(`
            <img src="${cupcake['image']}" class="img-fluid" alt="Cupcake Image">
            `);
        $('.cupcake-details').html(`
            <p><strong>Flavor:</strong> ${cupcake['flavor']}</p>
            <p><strong>Size:</strong> ${cupcake['size']}</p>
            <p><strong>Rating:</strong> ${cupcake['rating']}</p>
            `)
        return;
    }
};

// Handle cupcake form submission
$('#cupcake-add-form').on('submit', addCupcakeForm);

async function addCupcakeForm(e){
    e.preventDefault();
    const cupcakeData = $('.cc-deets');

    let serialized = {};
    for(let i in cupcakeData){
        serialized[cupcakeData[i]['name']] = cupcakeData[i]['value'];
    }
    resp = await axios.post(BASE_URL, serialized);
    let html = cupcakeDetails(resp.data.cupcake);
    $('ul').append(html);

    $('#cupcake-add-form').trigger('reset');
    return resp;
}

// Handle cupcake detail changes

// Handle searching for cupcake
$('#search-cupcake-form').on('submit', searchCupcakeForm);

async function searchCupcakeForm(e){
    e.preventDefault();
    const searchTerm = JSON.stringify($('#search-cupcake'));
    resp = await axios.get(`${BASE_URL}/search`, searchTerm);
    
}