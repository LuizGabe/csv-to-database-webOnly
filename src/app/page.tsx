'use client'

import { connectToPostgres } from "@/app/database"
import React, { useState, useEffect } from "react"

// Icons
import { ArrowRightIcon, UploadIcon, CalendarIcon } from '@radix-ui/react-icons'
import { DiPostgresql } from "react-icons/di";
import { GrMysql } from "react-icons/gr";

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
// import {  } from 'react-beautiful-dnd';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface dataInterface {
  dialect: string
  host: string
  databaseName: string
  port: string
  table: string
  user: string
  password: string
}

interface configInterface {
  header: boolean
  delimiter: string
}

interface badgeCSVInterface {
  id: string
  name: string
}

interface databaseColunsInterface {
  name: string
  type: string
}

interface databaseCsvConnectionInterface {
  databaseName: string
  csvHeader: string

}

export default function Home() {

  const [badgesCSV, setBadgesCSV] = useState<badgeCSVInterface[]>([
    {
      id: "1",
      name: "Nome"
    },
    {
      id: "2",
      name: "Data de Nascimento"
    },
    {
      id: "3",
      name: "Idade"
    },
    {
      id: "4",
      name: "Email"
    },
    {
      id: "5",
      name: "CPF"
    },
    {
      id: "6",
      name: "RG"
    },
    {
      id: "7",
      name: "Telefone"
    },
    {
      id: "8",
      name: "Celular"
    },
    {
      id: "9",
      name: "CEP"
    }
  ])
  const [databaseColumns, setDatabaseColumns] = useState<databaseColunsInterface[]>([
    {
      name: "nome",
      type: "text"
    },
    {
      name: "data_nascimento",
      type: "date"
    },
    {
      name: "idade",
      type: "number"
    },
    {
      name: "email",
      type: "text"
    }
  ])

  const [databaseCsvConnection, setDatabaseCsvConnection] = useState<databaseCsvConnectionInterface[]>([])

  const [fileName, setFileName] = useState("")
  const [connectSucess, setConnectSucess] = useState(false)
  const [checkTestConnection, setCheckTestConnection] = useState(true)
  const [configuration, setConfiguration] = useState({
    header: true,
    delimiter: ";"
  } as configInterface)
  const [connectionData, setConnectionData] = useState({
    dialect: "postgres",
    host: "",
    databaseName: "",
    port: "",
    table: "",
    user: "",
    password: ""
  } as dataInterface)

  useEffect(() => {
    console.log(connectionData)
  }, [connectionData])

  useEffect(() => {
    console.log(configuration)
  }, [configuration])


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0]
    const fileSize = file?.size

    if (!file) {
      alert("Por favor, selecione um arquivo CSV compatível!")
      return
    }

    if (file.type !== "text/csv") {
      alert("Por favor, selecione um arquivo CSV compatível!")
      return
    }

    if (event.target.files?.length !== 1) {
      alert("Por favor, selecione apenas um arquivo CSV!")
      return
    }

    if (fileSize && fileSize > 1024 * 1024 * 1024) { // 1Gb = 1000000000
      alert("Por favor, selecione um arquivo CSV menor que 1Gb!")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const csv = reader.result as string
      console.log(csv)
    }
    reader.readAsText(file)

    setFileName(file.name)
  }

  const handleTestConnection = async () => {

    try {

      const databaseInfo = await connectToPostgres()

      if (!databaseInfo) {
        console.log("Conexão falhou!")
        console.log(databaseInfo)
        return
      }
      console.log(databaseInfo)
      setConnectSucess(true)

    } catch (error) {
      setConnectSucess(false)
      console.error(`Erro ao testar a conexão: ${error}`)
    }
  }

  const onDragEnd = (result: any, provider: any) => {
    if (!result.destination) {
      return
    }

    const itens: badgeCSVInterface[] = Array.from(badgesCSV)
    const [removed] = itens.splice(result.source.index, 1)
    itens.splice(result.destination.index, 0, removed)

    setBadgesCSV(itens)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 justify-between w-screen items-center pl-4 pr-4 border-b-2 rounded-b-lg">
        <Label htmlFor="fileInput" className="text-2xl">Csv to Database</Label>
        <div className="flex gap-4 items-center">
          <Label htmlFor="fileInput" className="text-sm">
            <div className="border p-1 pl-2 pr-2 items-center flex rounded cursor-pointer hover:bg-accent">
              <UploadIcon className="h-4 w-4" />
              <p className="ml-2">{fileName ? `Carregado ${fileName}` : "Selecione o arquivo CSV"}</p>
            </div>
            <Input id="fileInput" className="hidden" type="file" accept=".csv" onChange={handleFileChange} />
          </Label>

          <ArrowRightIcon className="h-10 w-10" />

          <Sheet>
            <SheetTrigger asChild>
              <Button className="h-8 hover:bg-primary/40">Conectar Database</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Conecte ao Banco de Dados</SheetTitle>
                <SheetDescription>
                  Nesta seção você pode configurar a sua conexão com o banco de dados.
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 py-4">

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tipo DB</Label>
                  <Select value={connectionData.dialect} onValueChange={(value) => setConnectionData({ ...connectionData, dialect: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o banco de dados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="postgres">
                          <Badge variant="default" className="gap-2 hover:bg-primary">
                            <p>PostgreSQL</p>
                            <DiPostgresql className="h-5 w-5" /></Badge>
                        </SelectItem>
                        <SelectItem value="mysql">
                          <Badge variant="default" className="gap-2 hover:bg-primary">
                            <p>MySQL</p>
                            <GrMysql className="h-5 w-5" /></Badge>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="host" className="text-right">
                    Host
                  </Label>
                  <Input autoComplete="off" id="host" placeholder="Ex: 192.168.1.100"
                    value={connectionData.host}
                    onChange={(e) => setConnectionData({ ...connectionData, host: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="database" className="text-right">
                    Database
                  </Label>
                  <Input autoComplete="off" id="database" placeholder="Ex: MyDatabase"
                    value={connectionData.databaseName}
                    onChange={(e) => setConnectionData({ ...connectionData, databaseName: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="port" className="text-right">
                    Port
                  </Label>
                  <Input autoComplete="off" type="number" id="port" placeholder="5432"
                    value={connectionData.port}
                    onChange={(e) => setConnectionData({ ...connectionData, port: e.target.value })}
                    className="col-span-3 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Table
                  </Label>
                  <Input autoComplete="off" id="table" placeholder="Ex: MyTable"
                    value={connectionData.table}
                    onChange={(e) => setConnectionData({ ...connectionData, table: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <Separator />
                <Label className="text-lg">Acesso</Label>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    User
                  </Label>
                  <Input autoComplete="off" id="username" placeholder="Ex: postgres"
                    value={connectionData.user}
                    onChange={(e) => setConnectionData({ ...connectionData, user: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <form className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input autoComplete="off" type="password" id="password"
                    value={connectionData.password}
                    onChange={(e) => setConnectionData({ ...connectionData, password: e.target.value })}
                    className="col-span-3"
                  />
                </form>
              </div>

              <Separator />

              <SheetFooter className="mt-10">
                <SheetClose asChild>
                  <div className="flex items-center gap-8">
                    {checkTestConnection && (
                      <div className="w-30 h-6 transition-opacity duration-1000 ease-in-out opacity-100">
                        {connectSucess ? (
                          <Badge variant="noHover" className="bg-green-700 hover:bg-green-700 drop-shadow-glow">Conexão bem sucedida!</Badge>
                        ) : (
                          <Badge variant="noHover" className="bg-red-500 animate-pulse drop-shadow-glow">Conexão mal sucedida!</Badge>
                        )}
                      </div>
                    )}
                    <Button type="submit" onClick={() => handleTestConnection()}>Conectar</Button>

                  </div>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

        </div>
      </header>

      <main className="w-full h-full flex">
        <div className="w-80 border-2 border-y-0 border-l-0 bg-slate-900/80 justify-center flex flex-col">

          {/* Configurations */}
          <div className="w-full h-40 flex flex-col gap-2 items-center justify-center">

            <div className="bg-slate-800 p-4 border-2 rounded-lg border-slate-950">
              <div>
                <h1 className="text-xl">Configurações</h1>
              </div>

              <div className="flex items-center justify-end gap-3 pb-2 pt-2">
                <Label htmlFor="header" className="text-right text-md">Header: </Label>
                <Switch id="header" checked={configuration.header} onCheckedChange={(check) => setConfiguration({ ...configuration, header: check })} />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Label htmlFor="delimiter" className="text-right text-md">Delimitador: </Label>
                <Input id="delimiter" className="w-10 bg-primary font-bold text-md" value={configuration.delimiter} onChange={(e) => setConfiguration({ ...configuration, delimiter: e.target.value })} />
              </div>
            </div>
          </div>

          {/* CSV Elements */}
          <div className="w-full h-4/5 bg-slate-800 border-t-2 rounded-t-xl border-t-slate-950">
            <div className="w-full flex justify-center p-4">
              <h1 className="text-xl font-bold">Elementos CSV</h1>
            </div>

            <div className="w-full justify-center">
              <DragDropContext onDragEnd={onDragEnd}>

                <Droppable droppableId="droppable" type="list" direction="vertical">
                  {(provider) => (
                    <div ref={provider.innerRef} {...provider.droppableProps}>
                      {
                        badgesCSV.map((badge: badgeCSVInterface, index) => (

                          <Draggable key={badge.id} draggableId={badge.id} index={index}>
                            {(provider) => (
                              <div ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps}>
                                <Badge variant="noHover" className="font-bold text-xl">{badge.name}</Badge>
                              </div>
                            )}
                          </Draggable>

                        ))
                      }
                      {provider.placeholder}
                    </div>
                  )}
                </Droppable>

              </DragDropContext>
            </div>

          </div>
        </div>

        <div className="w-full h-full flex justify-center items-center">
          <div className="w-11/12 h-5/6">
            <Table>
              <TableHeader>
                <TableRow className="">
                  {
                    databaseColumns.map((column, i) => (
                      <TableHead className="w-[210px]" key={i}>{column.name.toUpperCase()}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {
                    databaseColumns.map((row, i) => (
                      <TableCell className="w-12" key={i}>
                        <DragDropContext onDragEnd={() => { }}>
                          <Droppable droppableId={row.name} key={i} type="list" direction="vertical">
                            {(provider) => (
                              <div ref={provider.innerRef} {...provider.droppableProps}>
                                <Draggable key={i} draggableId={i.toString()} index={i}>
                                  {(provider) => (
                                    <div ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps}>
                                      <Badge variant="noHover" className="font-bold text-xl">{row.name}</Badge>
                                    </div>
                                  )}
                                </Draggable>
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </TableCell>
                    ))
                  }
                </TableRow>
              </TableBody>
            </Table>
          </div>

        </div>

      </main>
      <footer className="border-t-2 justify-center flex items-center gap-2">
        <div className="flex items-center">
          <p>Feito com ❤️ por</p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="pl-2">@LuizGabe</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-90">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/LuizGabe.png" />
                  <AvatarFallback>Luiz</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Luiz Gabriel</h4>
                  <p className="text-sm">
                    Junior Developer, Always Studying.
                    {/* TODO: INTEGRAR COM A API DO GITHUB https://api.github.com/users/LuizGabe -> PEGAR O data.bio */}
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Developer since June 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

        </div>
        <p>2023</p>
      </footer>

    </div>
  )
}