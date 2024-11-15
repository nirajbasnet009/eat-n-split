import { useState } from "react";
import "./App.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setshowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [newFriend, setNewFriend] = useState("");
  const [imageLink, setImageLink] = useState(
    "https://i.pravatar.cc/48?u=499476"
  );
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleAddFriend() {
    if (newFriend && imageLink) {
      const id = crypto.randomUUID();
      const newFriendList = {
        id,
        name: newFriend,
        image: `${imageLink}=${id}`,
        balance: 0,
      };
      setFriends([...friends, newFriendList]);
      setNewFriend("");
      setImageLink("https://i.pravatar.cc/48?u=499476");
      setshowAddFriend(false);
    }
  }
  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setshowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + value,
            }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          handleSelection={handleSelection}
        />
        {showAddFriend && (
          <FormAddFriend
            newFriend={newFriend}
            setNewFriend={setNewFriend}
            imageLink={imageLink}
            setImageLink={setImageLink}
            handleAddFriend={handleAddFriend}
          />
        )}
        <Button onClick={() => setshowAddFriend(!showAddFriend)}>
          {showAddFriend === true ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({
  friends,
  showAddFriend,
  setSelectedFriend,
  selectedFriend,
  handleSelection,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friends
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          handleSelection={handleSelection}
        />
      ))}
    </ul>
  );
}

function Friends({
  friend,
  selectedFriend,
  setSelectedFriend,
  handleSelection,
}) {
  let isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected && "selected"}>
      <img src={friend.image} alt="img"></img>
      <div>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you ${friend.balance}
          </p>
        )}
        {friend.balance === 0 && (
          <p className="">You and {friend.name} are even.</p>
        )}
      </div>
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({
  newFriend,
  setNewFriend,
  imageLink,
  setImageLink,
  handleAddFriend,
}) {
  return (
    <form
      className="form-add-friend"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddFriend();
      }}
    >
      <label>🫂FriendName </label>
      <input
        type="text"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
      ></input>
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={imageLink}
        onChange={(e) => setImageLink(e.target.value)}
      ></input>
      <Button type="submit">Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill && !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💵Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🕴️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>
      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled></input>
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">Friend</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
export default App;
