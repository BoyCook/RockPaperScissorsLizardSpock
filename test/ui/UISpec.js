var casper = require('casper').create();

casper.start('http://localhost:3000/', function () {
    this.test.assertTitle('Rock Paper Scissors Lizard Spock [beta]', 'RPSLP homepage title is the one expected');
    this.test.assertExists('.rules', 'rules module is found');
    this.test.assertExists('.game-remote', 'game-remote module is found');
    this.test.assertExists('.game-local', 'game-local module is found');
    this.test.assertExists('.game-computer', 'game-computer module is found');
    this.test.assertExists('.about', 'about module is found');
    this.test.assertExists('.user-history', 'user-history module is found');
    this.test.assertExists('.user-details', 'user-details module is found');
    this.test.assertExists('.play-flash', 'play-flash module is found');
});

//Do login
//casper.then(function () {
//    this.click('.show-login');
////    'form[name="login-form"]'
//    this.fill('form#login-form', {
//            username: 'BoyCook',
//            password: 'password'
//        }, false);
//    this.test.assertField('username', 'BoyCook');
//    this.test.assertField('password', 'password');
//});

casper.run(function () {
    this.test.renderResults(true, 0, 'reports/TEST-UISpec.xml');
    this.test.done(5); // checks that 5 assertions have been executed
    this.test.renderResults(true);
});
