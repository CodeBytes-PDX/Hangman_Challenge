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

    // get some screen-drawing characters the kludgy way
    // instead of using some terminal library

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

    // pick a word and generate same-length string of blanks (underscores)
    word = get_word()
    for i := 0; i < len(word); i++ {
        word_show += "_"
    }

    on_gallows := 0
    for {
        fmt.Print(screen_clear)
        gallows(on_gallows)

        // exit the loop after drawing the gallows if the player has lost
        if on_gallows > 6 {
            break
        }

        // print the blanks plus correctly-guessed letters
        fmt.Print(cursor_home + "Word:" + cursor_down + word_show)

        // move the cursor below the gallows
        for i := 0; i < 10; i++ {
            fmt.Print(cursor_down)
        }

        // exit the loop after printing the word if the player has won
        if word_show == word {
            break
        }

        // print and clear any error/status message
        if len(message) > 0 {
            fmt.Println("** " + message)
            message = ""
        }

        // print previously-guessed letters for player's reference
        if len(guessed) > 0 {
            fmt.Println("Previous guesses: " + guessed)
        }

        // prompt and read the guess, converting to lower-case
        fmt.Print("Guess a letter: ")
        bio := bufio.NewReader(os.Stdin)
        guess_in, hasMoreInLine, err := bio.ReadLine()
        if err != nil {
            fmt.Println(guess, hasMoreInLine, err, strings.Index(word, guess))
            panic(err)
        }
        guess = strings.ToLower(string(guess_in))
        if len(guess_in) != 1 || guess[0] < 'a' || guess[0] > 'z' {
            message = "Please guess exactly one letter."
            continue
        }

        if strings.Index(guessed, guess) >= 0 {
            message = "You already guessed '" + guess + "'."
            continue
        }

        // add guessed letter to list of guesses
        guessed += string(guess)

        if strings.Index(strings.ToLower(word), guess) == -1 {
            // guessed letter not found in secret word;
            // increase counter of bad guesses
            on_gallows++
        } else {
            // guessed letter was found in the secret word;
            // substitute it into the string of blanks/revealed letters
            word_show_bytes := []byte(word_show)
            for i := 0; i < len(word); i++ {
                if strings.ToLower(word)[i] == guess[0] {
                    word_show_bytes[i] = word[i]
                }
            }
            word_show = string(word_show_bytes)
        }
    }
    fmt.Print("\nYou")
    if word_show == word {
        fmt.Println(" win!")
    } else {
        fmt.Println("'re zestfully dead! The word was \"" + word + "\".")
    }
}
