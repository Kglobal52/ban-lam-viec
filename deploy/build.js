// Tạo bản deploy SẠCH (không có dữ liệu cá nhân) từ app/ban-lam-viec.html
// Chạy: node deploy/build.js   →   deploy/index.html
// Thay nguyên hàm seed() bằng seed generic; mọi code khác giữ nguyên.
const fs = require("fs");

let h = fs.readFileSync("app/ban-lam-viec.html", "utf8");

const GENERIC_SEED = `function seed(){
  const m=(text)=>({id:uid(),text,on:false});
  const tk=(text,level,extra)=>Object.assign({id:uid(),text,level,today:false,done:false,subtasks:[],actual:0,addedToday:null,rolledDays:0},extra||{});
  return {
    version:4, theme:"light", lastOpened:ds(),
    morningDate:ds(),
    morning:[m("Lấy nước"),m("Thiền 5 phút"),m("Tuyên bố và hình dung"),m("Nhật ký Biết Ơn"),m("Nhật ký thành công"),m("Đọc sách"),m("Lên danh sách công việc ngày"),m("Tập thể dục")],
    sos:{focus:25,short:5,long:15,perLong:4,sesCount:0,sesDate:ds(),mode:"idle",endsAt:0,taskId:null,longNext:false},
    tasks:[
      tk("Ví dụ: việc quan trọng nhất tuần này",1,{today:true,addedToday:ds(),subtasks:[{id:uid(),text:"Bước nhỏ 1",done:false},{id:uid(),text:"Bước nhỏ 2",done:false}]}),
      tk("Ví dụ: việc làm sau",2),
      tk("Ví dụ: việc tương lai",3),
    ],
    projects:[],
    habits:[{id:uid(),name:"Ngủ sớm (trước 22h)",days:{}},{id:uid(),name:"Dậy sớm",days:{}},{id:uid(),name:"Tập thể dục",days:{}}],
    notes:[{id:uid(),label:"Thêm link công cụ của bạn",url:""}],
    calendar:[],
    week:[],
    reviews:[],
    rolloverSeen:true,
  };
}`;

const start = h.indexOf("function seed(){");
const marker = "\nlet S=load();";
const end = h.indexOf(marker);
if (start < 0 || end < 0) { console.error("✗ Không tìm thấy ranh giới seed()"); process.exit(1); }

h = h.slice(0, start) + GENERIC_SEED + h.slice(end);
fs.writeFileSync("deploy/index.html", h);

// Kiểm tra không còn chuỗi cá nhân
const SENSITIVE = ["docs.google.com/spreadsheets", "thầy Long", "thầy Huân", "Hoàng Anh", "Nha Trang", "Kari", "kênh story", "lịch sử sinh tồn", "PTL", "1sMfw38N8"];
let leak = false;
SENSITIVE.forEach(k => { if (h.includes(k)) { console.log("⚠ CÒN SÓT:", k); leak = true; } });
console.log(leak ? "✗ Vẫn còn dữ liệu cá nhân — kiểm tra lại" : "✓ deploy/index.html SẠCH — an toàn để công khai");
