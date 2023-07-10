import React, { useState } from "react";
import Cell from "./Cell";
import assembler from "../emulator/assembler";
import testASM from "../emulator/testasm";
import cpu from "../emulator/cpu";

export default function Memory({ data }) {
  const [assemblerState, setAssemblerState] = useState(data);
  let emuTest = new assembler();

  function handleCLick() {
    let newtest = ["51", "23", "64", "56", "77", "89", "23", "02", "14", "03", "40", "54", "b1", "03", "b9", "01", "C0", "00"];
    let nextCells = assemblerState.slice();
    
    const testCode = `;3-op functions
group1:
  add r1,r2,r1
  sub r4,r5,r6 ;testing
  ior rA,rB,rC

;2-op functions
group2:
mov r3,r2
ldr r4,$03
ldr r2, #04
;jump functions
group3: 
beq r1,$03
beq r9,group1
hlt`;
    emuTest.setCodeToAssemble(testASM.code);
    emuTest.assemble();
    const newCells = emuTest.getAssembledCode();
    for (let i = 0; i < newCells.length; i++) {
      nextCells[i] = newCells[i];
    }
    setAssemblerState(nextCells);
  }

  function generate16WidthTable() {
    let newTable = new Array(16);
    for (let i=0; i<16; i++) {
      let offsetIndex = i*16;
      newTable[i] = assemblerState.slice(offsetIndex, offsetIndex+16);
    }
    return (newTable);
  }

  function celltable() {  
    let table = generate16WidthTable();
    return (
      <table>
        <tbody>
          {table.map((rowValue, rowIndex) => {
            return [
              <tr key={rowIndex}>
                {rowValue.map((columnValue, columnIndex) => {
                  return [
                    <td key={ rowIndex.toString(16)+columnIndex.toString(16) }>
                      <Cell key={ columnIndex.toString(16)+columnValue } value={ columnValue}></Cell>
                    </td>
                  ];
                })}
              </tr>
            ];
          })}
        </tbody>
      </table>
    );
  }
  
  return (
    <>
      <div>
        { celltable() }
      </div>
      <button onClick={handleCLick}>assemble</button>
      <button onClick={(() => {
        let emucpu = new cpu(assemblerState);
        emucpu.run();
      }

      )}>
        cpu testing
      </button>
    </>
  );
}