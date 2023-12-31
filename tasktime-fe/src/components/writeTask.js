import React from 'react';
import { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

function WriteTask(props) {
  const [value, setValue] = useState();
  const [newTask, setNewTask] = useState({
    task: '',
    desc: '',
    who: '',
    dueDate: '',
    done: false,
  })
  const { Notifier } = props;

  function handleSubmit(e) {
    e.preventDefault();
    if (!value) {
      Notifier(null, 'blank');
    } else {
      const dDate = value.$d.toLocaleDateString();
      setNewTask((prevData) => {
        prevData.dueDate = dDate;
        return {
          prevData
        }
      });
      props.Saving(newTask);
      setNewTask({
        task: '',
        desc: '',
        who: '',
        dueDate: '',
        done: false,
      });
      setValue('');
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setNewTask((prevTask) => {
      return {
        ...prevTask,
        [name]: (type === "checked") ? checked : value,
      }
    });
  }

  return (
    <form className='form-box'>
      <div className='box-top'>
        <FormControl fullWidth >
          <FormControlLabel
            name="task"
            value={newTask.task}
            control={<TextField label="Task Name" variant="outlined" fullWidth sx={{paddingBottom: 2,}} />}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth >
          <FormControlLabel
            name="who"
            value={newTask.who}
            control={<TextField label="Assignee" variant="outlined" fullWidth sx={{paddingBottom: 2,}} />}
            onChange={handleChange}
          />
        </FormControl>
      </div>
      <div className='box-middle'>
        <FormControl fullWidth>
          <FormControlLabel
            name="desc"
            value={newTask.desc}
            control={<TextField label="Description" variant="outlined" fullWidth />}
            onChange={handleChange}
          />
        </FormControl>
      </div>
      <div className='box-bottom'>
        <div >
          <FormControl fullWidth >
            <FormControlLabel
              name="done"
              checked={newTask.done}
              control={<Checkbox fullWidth />}
              label="Complete"
              onChange={handleChange}
            />
          </FormControl>
        </div>
        <div >
          <FormControl fullWidth >
            <FormControlLabel
              name="dueDate"
              value={value}
              onChange={(newValue) => setValue(newValue)}
              control={
                <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                  <DemoContainer components={['DateField']}>
                    <DateField 
                      label="DueDate" 
                      value={value}
                      onChange={(newValue) => setValue(newValue)} />
                  </DemoContainer>
                </LocalizationProvider>
              }
            />
          </FormControl>
        </div>
      </div>
      <div className='box-btn'>
        <FormControl fullWidth >
          <Button variant='contained' onClick={handleSubmit} color="error" >Submit</Button>
        </FormControl>
      </div>
    </form>
  )
}

export default WriteTask;