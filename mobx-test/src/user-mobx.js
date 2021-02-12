import { observable, computed, action } from "mobx";

class appleStore {
  @observable
  apples = [
    {
      id: 0,
      weight: 233,
      isEaten: false,
    },
    {
      id: 1,
      weight: 235,
      isEaten: true,
    },
    {
      id: 2,
      weight: 256,
      isEaten: false,
    },
    {
      id: 3,
      weight: 256,
      isEaten: false,
    },
  ];
  @observable
  buttonText = "摘苹果";
  @computed
  get status() {
    let status = {
      appleNow: {
        quantity: 0,
        weight: 0,
      },
      appleEaten: {
        quantity: 0,
        weight: 0,
      },
    };
    this.apples.forEach((apple) => {
      let selected = apple.isEaten ? "appleEaten" : "appleNow";
      status[selected].quantity++;
      status[selected].weight += apple.weight;
    });
    return status;
  }
  @action
  eatApple = (appleId) => {
    this.apples.forEach((apple, index) => {
      if (apple.id == appleId) {
        this.apples[index].isEaten = true;
      }
    });
  };

  @action
  pickApple = () => {
    this.apples = [
      ...this.apples,
      {
        id: this.apples[this.apples.length - 1].id + 1,
        weight: Math.ceil(Math.random() * 100 + 100),
        isEaten: false,
      },
    ];
  };
}
const store = new appleStore();
export default store;
