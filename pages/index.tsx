import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [fireData, setFireData] = useState([]);
  const databaseRef = collection(database, "CRUD Data");

  const addData = () => {
    addDoc(databaseRef, {
      name: name,
      age: age,
      hobby: hobby,
    })
      .then(() => {
        alert("Data Sent");
        getData();
        setName("");
        setAge("");
        setHobby("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getData = async () => {
    await getDocs(databaseRef).then((response: any) => {
      setFireData(
        response.docs.map((data: any) => {
          return { ...data.data(), id: data.id };
        })
      );
    });
  };

  const getID = (id: any, name: any, age: any, hobby: any) => {
    setID(id);
    setName(name);
    setAge(age);
    setHobby(hobby);
    setIsUpdate(true);
  };

  const updateFields = () => {
    let fieldToEdit = doc(database, "CRUD Data", ID);
    updateDoc(fieldToEdit, {
      name: name,
      age: age,
      hobby: hobby,
    })
      .then(() => {
        alert("Data Updated");
        setID("");
        setName("");
        setAge("");
        setHobby("");
        setIsUpdate(false);
        getData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteDocument = (id: any) => {
    let fieldToEdit = doc(database, "CRUD Data", id);
    deleteDoc(fieldToEdit)
      .then(() => {
        alert("Data Deleted");
        getData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.customTitle}>Marosol User TEST</h1>
        <div className={styles.inputWrap}>
          <input
            type="text"
            placeholder="Name"
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            placeholder="Age"
            className={styles.input}
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
          <input
            type="text"
            placeholder="Hobby"
            className={styles.input}
            value={hobby}
            onChange={(event) => setHobby(event.target.value)}
          />
          {isUpdate ? (
            <button className={styles.btn} onClick={updateFields}>
              UPDATE
            </button>
          ) : (
            <button className={styles.btn} onClick={addData}>
              ADD
            </button>
          )}

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Hobby</th>
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {fireData &&
                fireData.map((data: any) => {
                  return (
                    <tr key={data.name}>
                      <td>{data.name}</td>
                      <td>{data.age}</td>
                      <td>{data.hobby}</td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() =>
                            getID(data.id, data.name, data.age, data.hobby)
                          }
                        >
                          수정
                        </button>
                        <button onClick={() => deleteDocument(data.id)}>
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Home;
