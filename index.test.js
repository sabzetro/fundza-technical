let postSelector = require('./index');
let FundzaPostSelector = postSelector.FundzaPostSelector;

test('init component', () => {

    var component = new FundzaPostSelector();


    expect(component).toBeInstanceOf(FundzaPostSelector);
});

test('get post by id change', () => {

    var component = new FundzaPostSelector();
    const spy = jest.spyOn(component, 'getPost');

    component.setAttribute('post-id', 1614);

     

    expect(spy).toHaveBeenCalled();

});

test('get post by search', () => {


    var component = new FundzaPostSelector();
    const spy = jest.spyOn(component, 'getPost'); 

    component.querySelector('#button').click();

    expect(spy).toHaveBeenCalled();
});

