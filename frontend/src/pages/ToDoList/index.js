import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Edit3, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem',
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '1rem',
  },
  input: {
    flexGrow: 1,
    marginRight: '1rem',
  },
  listContainer: {
    width: '100%',
    height: '100%',
    marginTop: '1rem',
    // backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  },
  list: {
    marginBottom: '5px',
  },
});

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      // Impede que o usuário crie uma tarefa sem texto
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      // Editar tarefa existente
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        text: task,
        updatedAt: now,
        createdAt: newTasks[editIndex].createdAt,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      // Adicionar nova tarefa
      setTasks([...tasks, { text: task, createdAt: now, updatedAt: now }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          label={i18n.t('todoList.newTask')}
          value={task}
          onChange={handleTaskChange}
          variant='outlined'
        />
        <Button variant='contained' color='primary' onClick={handleAddTask}>
          {editIndex >= 0 ? i18n.t('todoList.save') : i18n.t('todoList.add')}
        </Button>
      </div>
      <div className={classes.listContainer}>
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className={classes.list}>
              <ListItemText
                primary={task.text}
                secondary={task.updatedAt.toLocaleString()}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditTask(index)}>
                  <Edit3 />
                </IconButton>
                <IconButton onClick={() => handleDeleteTask(index)}>
                  <Trash2 />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ToDoList;
