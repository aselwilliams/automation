const {Builder, Capabilities, By} = require('selenium-webdriver')

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeAll(async ()=> {
    await driver.get('http://127.0.0.1:5501/movieList/')
})

afterAll(async ()=> {
    await driver.quit()
})

const addMovie=async(title)=> {
    let input = await driver.findElement(By.xpath('//input'))

        await input.clear()
        await input.sendKeys(`${title}`)

        let addButton = await driver.findElement(By.xpath('//button'))
        await addButton.click()
       await driver.sleep(3000)
}


const movieTitles = [`Avatar`, `RED`, `Ocean's Eleven`];

describe('movie-list tests', ()=> {
    test('should be able to cross off the movie when clicked on movie', async ()=> {

    await addMovie('Avatar')

        let movieTitle = await driver.findElement(By.xpath('//li/span'))
        await movieTitle.click()
      
        await driver.sleep(3000)

        expect(await driver.findElement(By.xpath('//span[contains(@class,"checked")]'))).toBeTruthy()
    })
    test('should delete the movie when clicked on x button', async()=> {
 
        await addMovie('Avatar')

       await driver.findElement(By.xpath('//button[contains(@id,"Avatar")]')).click()

       expect(await driver.findElement(By.id('message')).getText()).toBe('Avatar deleted!')

    })

    test('should add a movie when add button clicked', async()=> {
        await addMovie(movieTitles[0])
        let title = await driver.findElement(By.xpath('//span[1]')).getText()

        await driver.sleep(2000)
        expect(title).toBe(movieTitles[0])
    })

    test('x button for the movie should remove the movie title', async () => {
        //add the movie
        await addMovie(movieTitles[1]);

        //verify that the movie was added
        let movieWasAdded = await driver.findElement(By.id(`${movieTitles[1]}`)).isDisplayed();
        console.log(movieWasAdded);

        //delete the movie
        let deleteButton = await driver.findElement(By.id(movieTitles[1]));
        await deleteButton.click();

        await driver.sleep(2000);
        //verify that the movie was deleted
        try {
            //this will throw an error if the delete button for the newly added movie isn't found (or was deleted)
            let movieWasAdded = await driver.findElement(By.id(`${movieTitles[1]}`)).isDisplayed();
        } catch(e){
            //if an error was thrown, verify that the movie had been added before it was deleted
            expect(movieWasAdded).toBeTruthy();
        }
    });
    // test('clicking the movie title should strike it out', async () => {
    //     await addMovie(movieTitles[2]);
    //     await driver.sleep(2000);
    //     let title = await driver.findElement(By.id(`${movieTitles[2]}-span`));
    //     await driver.sleep(2000);
    //     await title.click();
    //     await driver.sleep(2000);

    //     expect(await title.getAttribute('class')).toBe('checked');
    // });
})