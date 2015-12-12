app.formatters = {
  phoneNumber: function(p){
    p = p.replace(/\D+/g, '');
    if (p.length === 10){ p = '1' + p; }
    p = p.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$2.$3.$4');
    return p;
  },
  timestamp: function(p){
    var d = Date.parse(p);
    return moment(d).fromNow();
  }
};