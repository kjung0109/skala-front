function showMyBag() {
  const myBag = [
    { name: "여권", count: 1 },
    { name: "노트북", count: 1 },
    { name: "이어폰", count: 2 },
    { name: "카메라", count: 1 },
  ];

  let message = "[내 가방 속 물품 목록]\n";

  for (let i = 0; i < myBag.length; i++) {
    message += "- " + myBag[i].name + " : " + myBag[i].count + "개\n";
  }

  message += "--------------------\n";
  message += "총 물품 종류: " + myBag.length + "가지";

  alert(message);
}
