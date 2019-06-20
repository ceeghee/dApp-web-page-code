App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // Check If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545'); //7545 for windows, 8545 for Linux verify port with your environment
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("./build/contracts/GoodluckEkeneToken.json", function(GoodluckEkeneToken) {
      App.contracts.GoodluckEkeneToken = TruffleContract(GoodluckEkeneToken);
      App.contracts.GoodluckEkeneToken.setProvider(App.web3Provider);
      App.contracts.GoodluckEkeneToken.deployed().then(function(GoodluckEkeneToken) {
        console.log("GoodluckEkeneToken Token Address:", GoodluckEkeneToken.address);
      });
    }).done(function() {
        return App.render();
    })
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    // loader.show();
    // content.hide();
    App.loading = false;
    loader.hide();
    content.show();
   
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Active Account: " + account);
      }
    })

  },

  createTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.GoodluckEkeneToken.deployed().then(function(instance) {
      return instance.mint(App.account, numberOfTokens)
    }).then(function success(result) {
      console.log("Tokens created successfully...")
      alert("Tokens Created Successfully")
      $('form').trigger('reset') // reset number of tokens in form
      var loader  = $('#loader');
      var content = $('#content');
      App.loading = false;
      loader.hide();
      content.show();
      // Wait for Sell event
    }, function error(e){
      alert('User Denied Transaction or you are not a Minter') 
      App.loading = false;
      var loader  = $('#loader');
      var content = $('#content');
      loader.hide();
      content.show();
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
