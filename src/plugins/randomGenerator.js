export default function (len) {
  let chrs = "abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789";
  var str = "";
  for (var i = 0; i < len; i++) {
    var pos = Math.floor(Math.random() * chrs.length);
    str += chrs.substring(pos, pos + 1);
  }
  return str;
}
