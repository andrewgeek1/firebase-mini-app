import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { Check, Database, Pencil, Plus, Trash2, X } from 'lucide-react';
import { db } from './firebase';
import './styles.css';

const COLLECTION_NAME = 'tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const tasksRef = useMemo(() => collection(db, COLLECTION_NAME), []);

  useEffect(() => {
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    // onSnapshot слушает Firestore в реальном времени.
    // Если запись изменится в Firebase Console, экран обновится сам.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextTasks = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setTasks(nextTasks);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tasksRef]);

  async function handleCreate(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    try {
      setError('');
      await addDoc(tasksRef, {
        title: cleanTitle,
        done: false,
        createdAt: serverTimestamp(),
      });
      setTitle('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function toggleDone(task) {
    try {
      setError('');
      await updateDoc(doc(db, COLLECTION_NAME, task.id), {
        done: !task.done,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  async function saveEdit(taskId) {
    const cleanTitle = editingTitle.trim();
    if (!cleanTitle) return;

    try {
      setError('');
      await updateDoc(doc(db, COLLECTION_NAME, taskId), {
        title: cleanTitle,
      });
      setEditingId(null);
      setEditingTitle('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function removeTask(taskId) {
    try {
      setError('');
      await deleteDoc(doc(db, COLLECTION_NAME, taskId));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <div className="hero">
          <div className="iconBox"><Database size={28} /></div>
          <div>
            <p className="eyebrow">Firebase + Firestore</p>
            <h1>Мини-приложение с базой данных</h1>
            <p className="subtitle">
              Добавляй, редактируй и удаляй задачи. Все изменения сохраняются в Cloud Firestore и обновляются на экране в реальном времени.
            </p>
          </div>
        </div>

        <form className="form" onSubmit={handleCreate}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: разобраться с Firebase"
            aria-label="Название задачи"
          />
          <button type="submit"><Plus size={18} /> Добавить</button>
        </form>

        {error && (
          <div className="error">
            <strong>Ошибка Firebase:</strong> {error}
            <p>Проверь .env, включен ли Firestore, и разрешают ли Rules чтение/запись.</p>
          </div>
        )}

        <div className="infoGrid">
          <div><span>Коллекция</span><b>{COLLECTION_NAME}</b></div>
          <div><span>Операции</span><b>Create / Read / Update / Delete</b></div>
          <div><span>Обновления</span><b>Realtime через onSnapshot</b></div>
        </div>

        <section className="list">
          {loading ? (
            <p className="muted">Загрузка данных из Firestore...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">Пока записей нет. Добавь первую задачу — она появится в Firebase Console.</p>
          ) : (
            tasks.map((task) => (
              <article className="task" key={task.id}>
                <button className={task.done ? 'check done' : 'check'} onClick={() => toggleDone(task)} aria-label="Переключить статус">
                  {task.done && <Check size={16} />}
                </button>

                {editingId === task.id ? (
                  <input
                    className="editInput"
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    autoFocus
                  />
                ) : (
                  <div className="taskText">
                    <b className={task.done ? 'completed' : ''}>{task.title}</b>
                    <span>ID документа: {task.id}</span>
                  </div>
                )}

                <div className="actions">
                  {editingId === task.id ? (
                    <>
                      <button className="ghost" onClick={() => saveEdit(task.id)}><Check size={17} /></button>
                      <button className="ghost" onClick={() => setEditingId(null)}><X size={17} /></button>
                    </>
                  ) : (
                    <>
                      <button className="ghost" onClick={() => startEdit(task)}><Pencil size={17} /></button>
                      <button className="ghost danger" onClick={() => removeTask(task.id)}><Trash2 size={17} /></button>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
