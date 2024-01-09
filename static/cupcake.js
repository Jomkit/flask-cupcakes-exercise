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

function cupcakeLi(cupcake){
    let html = `<li class='list-group-item' id="${cupcake['id']}"><button type="button" class="btn modal-btn" data-bs-toggle="modal" data-bs-target="#cupcakeModal">${cupcake['flavor']}</button><div class="position-absolute top-0 end-0 mt-2"><button class="btn btnTrash">&#10006;</button></div></li>`;

    return html;
}

async function editCupcakeForm(id){
    const resp = await axios.get(`${BASE_URL}/${id}`);
    const cupcake = resp.data.cupcake;
    const html = `<form method="POST">
    <div class="edit-form-field">
        <label for="flavor">Cupcake Flavor: </label>
        <input class="edit-vals" type="text" name="flavor" id="flavor" value="${cupcake['flavor']}"/>
    </div>
    <div class="edit-form-field">
        <label for="size">Cupcake Size: </label>
        <input class="edit-vals" type="text" name="size" id="size" value="${cupcake['size']}"/>
    </div>
    <div class="edit-form-field">
        <label for="rating">Cupcake Rating: </label>
        <input class="edit-vals" type="text" name="rating" id="rating" value="${cupcake['rating']}"/>
    </div>
    <div class="edit-form-field">
        <label for="image">Cupcake Image URL: </label>
        <input class="edit-vals" type="text" name="image" id="image" value="${cupcake['image']}"/>
    </div>
</form>`
    $('.cupcake-details').append(html);
}

function cupcakeModalDetails(cupcake){
    $('.modal-title').html(`<h2 class="display-4">Cupcake Details</h2>`);
    $('.cupcake-img').html(`
        <img src="${cupcake['image']}" class="img-fluid" alt="Cupcake Image">
        `);
    $('.cupcake-details').html(`
        <p><strong>Flavor:</strong> ${cupcake['flavor']}</p>
        <p><strong>Size:</strong> ${cupcake['size']}</p>
        <p><strong>Rating:</strong> ${cupcake['rating']}</p>
        <button class="btn btn-danger edit-btn" id="${cupcake['id']}">Edit</button>
        `);
    return;
}

function listCupcakes(cupcakes){
    $('ul').html('');   // Reset onscreen list of cupcakes

    for(i=0; i<=cupcakes.length; i++){
        let cupcake = cupcakes[i];
        let html = cupcakeLi(cupcake);
        $("ul").append(html);
    }
}

async function allCupcakes(){
    const resp = await axios.get(BASE_URL);
    listCupcakes(resp.data['cupcakes']);
    
    return resp;
}

allCupcakes();

// functionality for deleting cupcake
// $('.btnTrash').on('click', deleteCupcake);

async function deleteCupcake(id){
    const resp = await axios.delete(`${BASE_URL}/${id}`);
    $(`#${id}`).remove();

    return resp;
}

$('ul').click(eventHandler);
$('.modal').click(eventHandler);

async function eventHandler(evt){


    if(evt.target.classList.contains('btnTrash')){
        // Delete cupcake from db and DOM
        console.log('Delete');
        const cupcake = evt.target.parentNode.parentNode;
        console.log(cupcake.id);
        deleteCupcake(cupcake.id);
        return;
    }
    else if($(evt.target).hasClass('modal-btn')){
        // click on cupcake to get cupcake info from modal, rewriting 
        // html to provide image, and cupcake details on the modal
        let cup_id = evt.target.parentNode.id;
        let resp = await axios.get(`${BASE_URL}/${cup_id}`);
        let cupcake = resp.data.cupcake;

        cupcakeModalDetails(cupcake);
        
        $('.save-btn').attr('id',cup_id);
        
        return;
    }
    else if($(evt.target).hasClass('edit-btn')){
        // User clicks on a cupcake detail (e.g. rating) and is able update the 
        // details of the cupcake

        const ccid = evt.target.id;
        editCupcakeForm(ccid);

        return;
    }
    else if($(evt.target).hasClass('save-btn')){
        // Update cupcake details
        const id = $('.save-btn').attr('id');
        vals = $('.edit-vals');
        let serialized = {};
    for(let i in vals){
        serialized[vals[i]['name']] = vals[i]['value'];
    }
        
        const resp = await axios.patch(`${BASE_URL}/${id}`, serialized);

        cupcakeModalDetails(serialized);

        return resp;
    }
};

// Handle add cupcake form submission
$('#cupcake-add-form').on('submit', addCupcakeForm);

async function addCupcakeForm(e){
    e.preventDefault();
    const cupcakeData = $('.cc-deets');

    let serialized = {};
    for(let i in cupcakeData){
        serialized[cupcakeData[i]['name']] = cupcakeData[i]['value'];
    }
    resp = await axios.post(BASE_URL, serialized);
    let html = cupcakeLi(resp.data.cupcake);
    $('ul').append(html);

    $('#cupcake-add-form').trigger('reset');
    return resp;
}

// Handle cupcake detail updates

// Handle searching for cupcake
// $('#search-cupcake-form').on('submit', searchCupcakeForm);
$('#search-cupcake').on('keyup', searchCupcakeForm);

async function searchCupcakeForm(e){
    e.preventDefault();
    const searchTerm = $('#search-cupcake').val();
    resp = await axios.get(`${BASE_URL}/search?term=${searchTerm}`);
    listCupcakes(resp.data.cupcakes);

    return resp;
}