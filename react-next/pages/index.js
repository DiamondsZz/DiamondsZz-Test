import React from "react";
import styles from "../styles/Index.module.css";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: 500,
    height: 200,
    margin: "50px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
Modal.setAppElement("#container");
export default function Home() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [items, setItems] = React.useState([
    {
      name: "添加快捷方式",
    },
  ]);
  function openModal(item) {
    if (!item.icon) setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function add() {
    if (url && url.trim() && name && name.trim()) {
      setIsOpen(false);
      setItems([{ name, icon: `http://favicon.cccyun.cc/${url}` }, ...items]);
    }
  }
  return (
    <div id="container" className={styles.container}>
      <div className={styles.logo}></div>
      <input
        className={styles.search}
        placeholder="在Google上搜索，或者输入一个网址"
      ></input>
      <div className={styles.items}>
        {items.map((item, i) => (
          <div key={i} className={styles.item} onClick={() => openModal(item)}>
            <div className={styles.itemIcon}>
              {item.icon ? (
                <img className={styles.itemImg} src={item.icon} />
              ) : (
                <div className={styles.itemPlus}>+</div>
              )}
            </div>
            <div className={styles.itemName}>{item.name}</div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <input
            value={url}
            style={{
              width: "100%",
              height: "30px",
              border: "none",
              backgroundColor: "rgba(241, 243, 244, 1)",
              outline: "none",
              paddingLeft: "20px",
            }}
            placeholder="请输入网址"
            onChange={(e) => setUrl(e.target.value)}
          ></input>
        </div>

        <div style={{ width: "100%", height: "30px" }}>
          <input
            value={name}
            style={{
              width: "100%",
              height: "30px",
              border: "none",
              backgroundColor: "rgba(241, 243, 244, 1)",
              outline: "none",
              paddingLeft: "20px",
            }}
            placeholder="请输入名字"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <button
            style={{
              marginTop: "20px",
              width: "100px",
              height: "30px",
            }}
            onClick={add}
          >
            确定
          </button>
        </div>
      </Modal>
    </div>
  );
}
