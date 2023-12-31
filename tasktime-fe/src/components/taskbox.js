import React from 'react';
import { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import { Button, Snackbar, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function TaskBox(props) {
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState("Click in Search Assignee and type name to filter list, then select assignee and hit enter to show to do tasks.");
  const [taskEdit, setTaskEdit] = useState(false);
  const [edit, setEdit] = useState({
    id: props.data._id,
    task: props.data.task,
    desc: props.data.desc,
    who: props.data.who,
    dueDate: props.data.dueDate,
    done: props.data.done
  });

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={CloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  function CloseSnack() {
    setOpen(false);
  }

  function handleChange(e) {
    e.preventDefault();
    const { name, value, type, checked } = e.target;
    setEdit((prevData) => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      }
    })
  }

  function setItEditable(e) {
    e.preventDefault();
    setTaskEdit(prevEd => !prevEd);
  }

  function DeleteIt() {
    props.RecToDelete(prevRe => !prevRe);
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit)
    };
    const url = `https://timetaskapi.onrender.com/api/tasks/${edit.id}`;
    (async () => {
      await fetch(url, requestOptions)
        .then(response => {
          if (response.ok) {
            //let timetask component knows records was deleted to refresh list
            props.RecToDelete(prevRe => !prevRe);
          }
        })
        .catch(err => {
          return err;
        })
    })();
  }

  function SaveEdit() {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit)
    };
    const url = `https://timetaskapi.onrender.com/api/tasks/${edit.id}`;
    (async () => {
      await fetch(url, requestOptions)
        .then(response => {
          return response.json();
        })
        .then(data => {
          setNotify(`Last Edit saved: Task "${data.task}" "${data.desc}" assigned to ${data.who} due on ${data.dueDate} was saved successfully!`);
          setTaskEdit(preEd => !preEd);
        })
        .catch(err => {
          return err;
        })
      setOpen(true);
    })();
  }
  
  return (
    <div key={edit.id} >
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        autoHideDuration={6000}
        message={notify}
        action={action}
      />
      <div className='box-top'>
        <FormControl fullWidth >
          <FormControlLabel
            disabled={!taskEdit}
            name="task"
            value={edit.task}
            control={<TextField label="Task Name" variant="outlined" fullWidth sx={{paddingBottom: 2,}} />}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth >
          <FormControlLabel
            disabled={!taskEdit}
            name="who"
            value={edit.who}
            control={<TextField label="Assignee" variant="outlined" fullWidth sx={{paddingBottom: 2,}} />}
            onChange={handleChange}
          />
        </FormControl>
      </div>
      <div>
        <div className='box-middle'>
          <FormControl fullWidth>
            <FormControlLabel
              name="desc"
              value={edit.desc}
              disabled={!taskEdit}
              control={<TextField label="Description" variant="outlined" fullWidth />}
              onChange={handleChange}
            />
          </FormControl>
        </div>
      </div>
      <div className='box-bottom'>
        <div >
          <FormControl fullWidth>
            <FormControlLabel
              disabled={!taskEdit}
              control={<Checkbox />}
              label="Complete"
              name="done"
              checked={edit.done}
              onChange={handleChange}
            />
          </FormControl>
        </div>
        <div >
          <FormControl fullWidth >
            <FormControlLabel
              name="dueDate"
              value={edit.dueDate}
              disabled={!taskEdit}
              onChange={handleChange}
              control={<TextField label="Due Date" variant="outlined" fullWidth />}             
            />
          </FormControl>
        </div>
      </div>
      <div className='tasklist-btn'>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <FormControl fullWidth >
            {!taskEdit && <Button
              className="task-edit-btn"
              variant="contained"
              color="warning"
              size="small"
              name="Edit"
              onClick={setItEditable}
              startIcon={<EditIcon />}>
              Edit
            </Button>}
            {taskEdit && <Button
              className="task-edit-btn"
              variant="contained"
              color="warning"
              size="small"
              name="Submit"
              onClick={SaveEdit}
              startIcon={<EditIcon />}>
              Submit
            </Button>}
          </FormControl>
          <FormControl fullWidth >
            <Button
              className="task-remove-btn"
              variant='outlined'
              color="error"
              size="small"
              onClick={DeleteIt}
              startIcon={<DeleteIcon />}>
              Remove
            </Button>
          </FormControl>
        </Stack>
      </div>
    </div>
  )
}

export default TaskBox;