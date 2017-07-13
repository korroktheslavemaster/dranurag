var pageSize = "A4",
    system = require('system'),
    pageOrientation = "portrait",
    dpi = 150, //from experimenting with different combinations of viewportSize and paperSize the pixels per inch comes out to be 150
    pdfViewportWidth = 1024,
    pdfViewportHeight = 768,
    cmToInchFactor = 0.393701,
    widthInInches,
    heightInInches,
    temp;

    switch(pageSize){
        case 'Letter':
        default:
            widthInInches = 8.5;
            heightInInches = 11;
            break;
        case 'Legal':
            widthInInches = 8.5;
            heightInInches = 14;
            break;
        case 'A3':
            widthInInches = 11.69
            heightInInches = 16.54;
            break;
        case 'A4':
            widthInInches = 8.27;
            heightInInches = 11.69;
            break;
        case 'A5':
            widthInInches = 5.83;
            heightInInches = 8.27;
            break;
        case 'Tabloid':
            widthInInches = 11;
            heightInInches = 17;
            break;
    }

    //reduce by the margin (assuming 1cm margin on each side)
    widthInInches-= 2*cmToInchFactor;
    heightInInches-= 2*cmToInchFactor;

    //interchange if width is equal to height
    if(pageOrientation === 'Landscape'){
        temp = widthInInches;
        widthInInches = heightInInches;
        heightInInches = temp;
    }

    //calculate corresponding viewport dimension in pixels
    pdfViewportWidth = dpi*widthInInches;
    pdfViewportHeight = dpi*heightInInches;

    page = require('webpage').create();
    page.paperSize = {  format: pageSize,  orientation: pageOrientation, margin: '0cm' };
    page.viewportSize = { width: pdfViewportWidth, height: pdfViewportHeight }; 
page.open(system.args[1], function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit(1);
    } else {
        window.setTimeout(function () {
            page.render(system.args[2]);
            phantom.exit();
        }, 200);
    }
});