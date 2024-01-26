'use client'

import React, { useState } from "react"

import { ArrowRightIcon, UploadIcon } from '@radix-ui/react-icons'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface dados {
  host?: string,
  database?: string,
  port?: number,
  table?: string
  user?: string,
  password?: string
}


export default function Home() {
  const [fileName, setFileName] = useState("")
  const [fileLoading, setFileLoading] = useState(false)
  const [dados, setDados] = useState({} as dados)
  const [connectSucess, setConnectSucess] = useState(false)
  const [checkTestConnection, setCheckTestConnection] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileLoading(true)

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

    setFileLoading(false)
    setFileName(file.name)
  }

  const handleTestConnection = async () => {

    try {
      const result = `dwdwddw`

      console.log(`Teste de conexão: ${result}`)
    } catch (error) {
      console.error(`Erro ao testar a conexão: ${error}`)
    }
  }

  return (
    <>
      <header className="flex h-11 justify-between w-screen items-center pl-4 pr-4">
        <Label htmlFor="fileInput" className="text-2xl">Csv to Database</Label>
        <div className="flex gap-4 items-center">
          <Label htmlFor="fileInput" className="text-sm">
            <div className="border p-1 pl-2 pr-2 items-center flex rounded cursor-pointer hover:bg-accent">
              <UploadIcon className="h-4 w-4" />
              <p className="ml-2">{fileName ? `Carregado ${fileName}` : "Selecione o arquivo CSV"}</p>
            </div>   
            <Input id="fileInput" className="hidden" type="file" accept=".csv" onChange={handleFileChange}/>
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
                  <Label htmlFor="host" className="text-right">
                    Host
                  </Label>
                  <Input autoComplete="off" id="host" placeholder="Ex: 192.168.1.100"
                    value={dados.host} 
                    onChange={(e) => setDados({...dados, host: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="database" className="text-right">
                    Database
                  </Label>
                  <Input autoComplete="off" id="database" placeholder="Ex: MyDatabase"
                    value={dados.database} 
                    onChange={(e) => setDados({...dados, database: e.target.value})}
                    className="col-span-3" 
                  />
                </div>
              
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="port" className="text-right">
                    Port
                  </Label>
                  <Input autoComplete="off"  type="number" id="port" placeholder="5432"
                    value={dados.port} 
                    onChange={(e) => setDados({...dados, port: parseInt(e.target.value)})}  
                    className="col-span-3 [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                </div>
              
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Table
                  </Label>
                  <Input autoComplete="off" id="table" placeholder="Ex: MyTable"
                    value={dados.table} 
                    onChange={(e) => setDados({...dados, table: e.target.value})}  
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
                    value={dados.user} 
                    onChange={(e) => setDados({...dados, user: e.target.value})} 
                    className="col-span-3" 
                  />
                </div>
              
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input autoComplete="off" type="password" id="password" 
                    value={dados.password}
                    onChange={(e) => setDados({...dados, password: e.target.value})} 
                    className="col-span-3" 
                  />
                </div>
              </div>
              
              <Separator />

              <div className="mt-4 mb-4 h-4 flex  justify-between items-center">
                <div className="flex items-center">
                  <Checkbox id="testConnection" onCheckedChange={() => setCheckTestConnection(!checkTestConnection)} />
                  <Label htmlFor="testConnection" className="text-right ml-2">
                    Testar Conexão
                  </Label>
                </div>

                {checkTestConnection && (
                  <div className="w-30 h-6 transition-opacity duration-1000 ease-in-out   opacity-100  ">
                    {connectSucess ? (
                      <Badge className="bg-green-700/80">Conexão bem sucedida!</Badge>
                    ): (
                      <Badge className="bg-red-700/80">Conexão mal sucedida!</Badge>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <SheetFooter className="mt-10">
                <SheetClose asChild>
                  <Button type="submit" onClick={() => handleTestConnection()}>Conectar</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

        </div>
      </header>

      <Separator />

      <main>

      </main>
      <footer>
        <p>Feito com ❤️ por <a href="https://github.com/LuizGabe">LuizGabe</a></p>
        <p>2023</p>
      </footer>
    </>
  )
}