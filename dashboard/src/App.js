import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import socketIOClient from "socket.io-client";

import { Button, Container, Row, Card, Toast } from "react-bootstrap";

function App() {
  const colors = [
    "#011627",
    "#2ec4b6",
    "#ff9f1c",
    "#4f000b",
    "#00509d",
    "#6a4c93",
    "#344e41",
  ];
  const size = useWindowSize();

  const [show, setShow] = useState(false);
  const [samplingRate, setSamplingRate] = useState(5000);
  const [SR, setSR] = useState(5);
  const [ready, setReady] = useState(false);
  const [greenHouses, setGreenHouses] = useState([]);
  const [updated, setUpdated] = useState(100);
  const [srUpdated, setSRupdated] = useState(false);
  const [maxDegrees, setMaxDegrees] = useState([]);
  //Bunu değiştim
  const socket = useRef();

  useEffect(() => {
    //Bunu değiştim
    socket.current = socketIOClient("http://localhost:8080");
    ready
      ? console.log(ready)
      : socket.current.emit("admin", {
          header: "clients",
        });
    socket.current.on("admin", (data) => {
      switch (data.header) {
        case "clients":
          data.value.map((item) => {
            if (
              greenHouses.find((greenHouse) => greenHouse.id === item.id) ===
              undefined
            )
              greenHouses.push(item);
          });
          setReady(true);
          break;
        case "disconnect":
          setGreenHouses(
            greenHouses.filter((greenHouse) => greenHouse.id !== data.value)
          );
          break;
        case "connection":
          greenHouses.push(data.value);

          break;
        case "settings":
          setSR(data.value / 1000);
          setSamplingRate(data.value);

          break;
        case "value":
          try {
            greenHouses
              .find((greenHouse) => greenHouse.id === data.id)
              .values.push({
                timeStamp: data.timeStamp,
                value: data.value,
                maxDegree: data.maxDegree,
              });
          } catch (error) {
            greenHouses.push({
              name: data.name,
              id: data.id,
              values: [
                {
                  timeStamp: data.timeStamp,
                  value: data.value,
                  maxDegree: data.maxDegree,
                },
              ],
            });
          }
          setUpdated(Math.random());
          break;
        default:
          break;
      }
    });
  }, []);

  //Bunu değiştim
  useEffect(() => {
    socket.current.emit("admin", {
      header: "settings",
      value: SR * 1000,
    });
  }, [srUpdated]);

  //Bunu ekledim - Maximum sıcaklık değerini arayüzde güncelleyince buradaki arraye ekliyor ya da değiştiriyor
  const handleChange = (event) => {
    event.preventDefault();
    maxDegrees.find((item) => item.name === event.target.name) === undefined
      ? maxDegrees.push({ name: event.target.name, value: event.target.value })
      : (maxDegrees.find((item) => item.name === event.target.name).value =
          event.target.value);
  };

  //Bunu ekledim - Maximum sıcaklığı server a gönderiyor
  const handleClick = (event) => {
    event.preventDefault();
    const degree = maxDegrees.find((item) => item.name === event.target.id)
      ?.value;
    socket.current.emit("admin", {
      header: "degree",
      value: {
        id: event.target.id,
        degree: degree || 35,
      },
    });
    setShow(true);
  };

  return ready ? (
    <div className="App">
      <Container fluid>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem",
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSRupdated(!srUpdated);
              console.log(srUpdated);
            }}
          >
            <p>
              Mevcut Örnekleme Hızı:{" "}
              <span style={{ color: "red" }}>{samplingRate / 1000} saniye</span>
            </p>
            <div className="form-group">
              <label htmlFor="samplingRate">Örnekleme Hızı(Saniye)</label>
              <small>
                Alttaki input alanına veri girdikçe otomatik olarak
                değiştirecektir.
              </small>
              <input
                type="number"
                min="1"
                className="form-control"
                id="samplingRate"
                onChange={(event) => setSR(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Güncelle
              </button>
            </div>
          </form>
        </Row>

        <Row>
          <LineChart
            width={size.width}
            height={size.height / 2 - updated}
            margin={{
              top: 20,
              right: size.width / 7,
              left: size.width / 15,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timeStamp"
              type="category"
              allowDuplicatedCategory={false}
            />
            <YAxis dataKey="value" type="number" domain={[0, 500]} />
            <Tooltip />
            <Legend />

            {greenHouses.map((greenHouse, index) => (
              <Line
                dataKey="value"
                type="monotone"
                stroke={colors[index]}
                strokeWidth={2}
                data={greenHouse.values}
                name={greenHouse.name}
                key={greenHouse.id}
              />
            ))}
          </LineChart>
        </Row>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem",
          }}
        >
          {greenHouses.map((greenHouse, index) => {
            try {
              return (
                <Card
                  style={{
                    margin: "2rem",
                    backgroundColor: colors[index],
                    color: "#fff",
                  }}
                  key={greenHouse.id}
                >
                  <Card.Body>
                    <Card.Title>Sera Adı: {greenHouse?.name}</Card.Title>
                    <Card.Text>
                      Son Sıcaklık:{" "}
                      {
                        greenHouse?.values[greenHouse?.values?.length - 1]
                          ?.value
                      }
                    </Card.Text>
                    <Card.Text>
                      Ölçüm Zamanı:{" "}
                      {
                        greenHouse?.values[greenHouse?.values?.length - 1]
                          ?.timeStamp
                      }
                    </Card.Text>
                    <Card.Text>
                      Belirlenen Maximum Sıcaklık:{" "}
                      <span
                        style={{
                          color: "#FF0000",
                          fontWeight: "900",
                        }}
                      >
                        {
                          greenHouse?.values[greenHouse?.values?.length - 1]
                            ?.maxDegree
                        }
                      </span>
                      {/***
                        Bunu ekledim - input alma kısmı
                      */}
                    </Card.Text>
                    <input
                      type="number"
                      min={1}
                      style={{
                        margin: "10px",
                        padding: "7px",
                      }}
                      name={greenHouse.id}
                      onChange={handleChange}
                    />
                    <Button
                      variant="primary"
                      style={{
                        margin: "10px",
                      }}
                      id={greenHouse.id}
                      onClick={handleClick}
                    >
                      Sıcaklığı Değiş
                    </Button>
                  </Card.Body>
                </Card>
              );
            } catch (error) {}
          })}
        </Row>
      {/***
        * Bunu ekledim 
        * toast Message
        */}
        <Toast
          animation={true}
          onClose={() => setShow(false)}
          show={show}
          delay={4000}
          autohide
          style={{
            backgroundColor: "#ccc",
            position: "absolute",
            bottom: 0,
            left: "3%",
          }}
        >
          <Toast.Header>
            <strong className="mr-auto">System</strong>
            <small>Şimdi</small>
          </Toast.Header>
          <Toast.Body>
            Güncelleme başarılı bir sonraki örneklemede sıcaklık değeri
            değişecektir.
          </Toast.Body>
        </Toast>
      </Container>
    </div>
  ) : (
    <div>Waiting Connection... Please wait...</div>
  );
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export default App;
