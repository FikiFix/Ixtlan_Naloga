import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react';
import './App.css'

const getMonthInfo = (year: number, month: number) => {
  if(month == 0){
    month = 12
    year -= 1
  }
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  return { daysInMonth, weekday: firstDay };
}


const stringifyDayInWeek = (day : number) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fry", "Sat"];
  return days[day % 7]
}

const stringifyMonth = (month : number) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return months[month -1];
}

type Date = {
  dayInMonth : number,
  dayInWeek : number,
  holiday : string,
  empty : boolean //true : day is not part of current month
}

type Holiday = {
  name : string;
  month : number;
  day : number;
  year : number;
  repeat : boolean;
}

function App() {
  const [dates, setDates] = useState<Date[]>([]); //array of dates for rendering on screen
  const [month, setMonth] = useState<number>(1); //current selected month
  const [year, setYear] = useState<number>(0); //current selected year
  const [yearBuffer, setYearBuffer] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const holidays = useRef<Holiday[]>([]);
  const [holidaysLoaded, setHolidaysLoaded] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fry", "Sat"];



  const changeYear = () => { //changes displayed year to year stored in "yearBuffer" state
    if(yearBuffer == ''){
      return
    }
    const parsed = parseInt(yearBuffer);

    if(isNaN(parsed)){
      alert("Please enter a valid year");
      setYearBuffer('');
      return;
    }
    if(Math.abs(parsed) > 30000){
      alert("Year out of range");
      setYearBuffer('');
      return;
    }
    setYear(parsed)
    setYearBuffer('');
  }

  const showDate = () => { //used to show month and year specified by user date input

    const dateArray = dateString.split('.').map(Number);
    if (dateArray.length != 3){
      alert("Please enter valid date. Format: day.month.year");
      return;
    }
    const month = dateArray[1];
    const year = dateArray[2];
    if(month < 1 || month > 12){
      alert("Enter valid month");
      return;
    }
    if(Math.abs(year) > 30000){
      alert("Year out of range");
      return;
    }


    setMonth(month);
    setYear(year);

  }

  const getHolidayName = (day: number, month : number, year : number) => {
    let holidayName = '';
    for (let holiday of holidays.current) {
      const isRepeat = holiday.repeat && holiday.month === month;
      const isUnique = !holiday.repeat && holiday.month === month && holiday.year === year;

      if ((isRepeat || isUnique) && holiday.day === day) {
        holidayName = holiday.name;
        break;
      }
    }
    return holidayName;
  }
  const getDates = () => {
    let { daysInMonth, weekday } = getMonthInfo(year, month);
    console.log("DAYS: ", daysInMonth, month)
    const { daysInMonth: prevDaysInMonth } = getMonthInfo(year, month - 1);
  
    const newDates: Date[] = [];
  
    if (weekday === 0) weekday = 7;
  
    //fill in empty days from previous month
    for (let i = 0; i < weekday - 1; i++) {
      newDates.push({
        dayInMonth: prevDaysInMonth - weekday + i + 2,
        dayInWeek: (i + 1) % 7,
        holiday: '',
        empty: true
      });
    }
  
    //fill in days from current month
    for (let i = 1; i <= daysInMonth; i++) {
        console.log("i: ", i,  daysInMonth, i <= daysInMonth)
      let holidayName = getHolidayName(i, month, year)
  
      newDates.push({
        dayInMonth: i,
        dayInWeek: (i + weekday - 1) % 7,
        holiday: holidayName,
        empty: false
      });
    }
  
    setDates(newDates);
  };

  const readFile = () => {
    fetch('/holidays.csv')
      .then (res => res.text())
      .then (data => {
        const lines = data.trim().split('\n').slice(1)
        const holidayBuffer = [];

        for (let line of lines) {
          const [name, date, repeat] = line.split(',');
          const [dStr, mStr, yStr] = date.split('.');
          const d = parseInt(dStr);
          const m = parseInt(mStr);

          const y = (repeat == 'True\r' ? 0 : parseInt(yStr));
          const r = (repeat == 'True\r');

          const holiday : Holiday = {
            name : name,
            month : m,
            day : d,
            year : y,
            repeat : r
          }
          holidayBuffer.push(holiday)
        }
        holidays.current = holidayBuffer;
        setHolidaysLoaded(true);
      })
  }



  useEffect(() => {
    getDates();
  }, [month, year, holidaysLoaded])


  useEffect(() => {
    readFile();
    setYear(2025);
  }, [])

  return (
    <div className='ScreenContainer'>
      <div className='CalendarContainer'>
        {/* CALENDAR HEADER */}
        <div className='HeaderContainer'>
          <div className='HeaderTop'>
            <p className='YearLabel'>{year}</p>
            <p className='MonthLabel'>{stringifyMonth(month)}</p>
          </div>
          <div className='HeaderBottom'>
            <div className='HeaderLeft'>
              {/*USER DATE INPUT*/}
              <input 
                  type='text'
                  value={dateString}
                  onChange={(e) => setDateString(e.target.value)}
                  placeholder="DD.MM.YYYY"
                  className='DateInput'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      showDate()
                    }
                  }}
                />
            </div>
            <div className='HeaderRight'>
              {/*MONTH SELECT*/}
              <select 
                value={month} 
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className='MonthInput'
              >
                {/*GENERATE MONTH OPTIONS LIST*/}
                {months.map((m, index) => ( 
                  <option key={m} value={index + 1}>
                      {m}
                  </option>
                ))}
              </select>
              
              {/*YEAR INPUT*/}
              <input
                type='text'
                value={yearBuffer}
                onChange={(e) => setYearBuffer(e.target.value)}
                placeholder={year.toString()}
                className='YearInput'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    changeYear();
                  }
                }}
              />
              {/*YEAR SEARCH BUTTON*/}
              <a onClick={changeYear}>
                <Search size={20} />
              </a>
            </div>
          </div>

        </div>
        {/* CALENDAR BODY */}
        <div className='DaysContainer'>

        {/* DAYS IN A WEEK DISPLAY */}
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className='Day'>
            {stringifyDayInWeek(i + 1)}
          </div>
        ))}
        </div>
        {/* DISPLAY DATES */}
        <div className='DatesContainer'>
          {dates.map((date, index) => {
            return(
              <div 
                key={index} 
                title={date.holiday || undefined}
                className={`DateContainer 
                  ${date.dayInWeek == 0 ? "Sunday " : ""}
                  ${date.empty ? "EmptyDate " : ""} 
                  ${date.holiday !== '' ? "Holiday " : ""}`}
              >
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {date.dayInMonth}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
