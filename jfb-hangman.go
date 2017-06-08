package main

import (
    "bufio"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "os/exec"
    "strings"
)

func gallows(parts int) {
    fmt.Println("                          ----------+")
    fmt.Print(  "                          ")
    if parts > 0 {
        fmt.Print("|")
    } else {
        fmt.Print(" ")
    }
    fmt.Println(                           "         |")

    fmt.Print(  "                          ")
    if parts > 1 {
        fmt.Print("O")
    } else {
        fmt.Print(" ")
    }
    fmt.Println("         |")

    fmt.Print(  "                         ")
    if parts > 3 {
        fmt.Print("\\")
    } else {
        fmt.Print(" ")
    }
    if parts > 2 {
        fmt.Print("|")
    } else {
        fmt.Print(" ")
    }
    if parts > 4 {
        fmt.Print("/")
    } else {
        fmt.Print(" ")
    }
    fmt.Println(                           "        |")

    fmt.Print(  "                         ")
    if parts > 5 {
        fmt.Print("/")
    } else {
        fmt.Print(" ")
    }
    fmt.Print(" ")
    if parts > 6 {
        fmt.Print("\\")
    } else {
        fmt.Print(" ")
    }
    fmt.Println(                            "        |")
    fmt.Println("                                    |")
    fmt.Println("                                    |")
    fmt.Println("                                    |")
    fmt.Println("                                    |")
    fmt.Println("-------------------------------------")
}

func get_word()(string) {
    resp, err := http.Get("http://setgetgo.com/randomword/get.php")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    return string(body)
}

func main() {

    var word, word_show, guessed, guess, message string

    message = ""

    cmd := exec.Command("tput", "home")
    home, err := cmd.Output()
    if err != nil {
        panic(err)
    }
    cursor_home := string(home)

    cmd = exec.Command("tput", "do")
    do, err := cmd.Output()
    if err != nil {
        panic(err)
    }
    cursor_down := string(do)

    cmd = exec.Command("clear")
    clear, err := cmd.Output()
    if err != nil {
        panic(err)
    }
    screen_clear := string(clear)

    word = get_word()
    for i := 0; i < len(word); i++ {
        word_show += "_"
    }

    on_gallows := 0
    for {
        fmt.Print(screen_clear)
        gallows(on_gallows)
        if on_gallows > 6 {
            break
        }
        fmt.Print(cursor_home + "Word:" + cursor_down + word_show)
        for i := 0; i < 10; i++ {
            fmt.Print(cursor_down)
        }

        if word_show == word {
            break
        }
        if len(message) > 0 {
            fmt.Println("*" + message)
        }
        if len(guessed) > 0 {
            fmt.Println("Previous guesses: " + guessed)
        }
        fmt.Print("Guess a letter: ")
        bio := bufio.NewReader(os.Stdin)
        guess_in, hasMoreInLine, err := bio.ReadLine()
        if len(guess_in) != 1 {
            message = "Please guess exactly one letter."
            bio = bufio.NewReader(os.Stdin)
            continue
        }
        guess = string(guess_in)
        if strings.Index(guessed, guess) >= 0 {
            message = "You already guessed '" + guess + "'."
            bio = bufio.NewReader(os.Stdin)
            continue
        }
        guessed += string(guess)
        if err != nil {
            fmt.Println(guess, hasMoreInLine, err, strings.Index(word, guess))
            panic(err)
        }
        if strings.Index(word, guess) == -1 {
            on_gallows++
        } else {
            word_show_bytes := []byte(word_show)
            for i := 0; i < len(word); i++ {
                if word[i] == guess[0] {
                    word_show_bytes[i] = guess[0]
                }
            }
            word_show = string(word_show_bytes)
        }
    }
    fmt.Print("\n")
    if word_show == word {
        fmt.Println("You win!")
    } else {
        fmt.Println("You're zestfully dead! The word was \"" + word + "\".")
    }
}
