/*****************************************************************************
* | File      	:   1in8LCD.ts
* | Author      :   hnwangkg-ezio for Waveshare 
* | Function    :   Contorl 1.8inch lcd Show
* | Info        :
*----------------
* | This version:   V2.0
* | Date        :   2021-01-28
* | Info        :   for micro:bit v2
*
******************************************************************************/
let GUI_BACKGROUND_COLOR = 1
let FONT_BACKGROUND_COLOR = 1
let FONT_FOREGROUND_COLOR = 0

let LCD_WIDTH = 160  //LCD width
let LCD_HEIGHT = 128 //LCD height

// SRAM opcodes
let SRAM_CMD_WREN = 0x06
let SRAM_CMD_WRDI = 0x04
let SRAM_CMD_RDSR = 0x05
let SRAM_CMD_WRSR = 0x01
let SRAM_CMD_READ = 0x03
let SRAM_CMD_WRITE = 0x02

// SRAM modes
let SRAM_BYTE_MODE = 0x00
let SRAM_PAGE_MODE = 0x80
let SRAM_STREAM_MODE = 0x40

enum COLOR {
    WHITE = 0xFFFF,
    BLACK = 0x0000,
    BLUE = 0x001F,
    BRED = 0XF81F,
    GRED = 0XFFE0,
    GBLUE = 0X07FF,
    RED = 0xF800,
    MAGENTA = 0xF81F,
    GREEN = 0x07E0,
    CYAN = 0x7FFF,
    YELLOW = 0xFFE0,
    BROWN = 0XBC40,
    BRRED = 0XFC07,
    GRAY = 0X8430
}

enum DOT_PIXEL{
    DOT_PIXEL_1 = 1,
    DOT_PIXEL_2,
    DOT_PIXEL_3,
    DOT_PIXEL_4
};

enum LINE_STYLE {
    LINE_SOLID = 0,
    LINE_DOTTED,
};

enum DRAW_FILL {
    DRAW_EMPTY = 0,
    DRAW_FULL,
};

let Font12_Table:number[] = 
[
    // @0 ' ' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @12 '!' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x00, //        

    // @24 '"' (7 pixels wide)
    0x00, //        
    0x6C, //  ## ## 
    0x48, //  #  #  
    0x48, //  #  #  
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @36 '#' (7 pixels wide)
    0x00, //        
    0x14, //    # # 
    0x14, //    # # 
    0x28, //   # #  
    0x7C, //  ##### 
    0x28, //   # #  
    0x7C, //  ##### 
    0x28, //   # #  
    0x50, //  # #   
    0x50, //  # #   
    0x00, //        
    0x00, //        

    // @48 '$' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x38, //   ###  
    0x40, //  #     
    0x40, //  #     
    0x38, //   ###  
    0x48, //  #  #  
    0x70, //  ###   
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        

    // @60 '%' (7 pixels wide)
    0x00, //        
    0x20, //   #    
    0x50, //  # #   
    0x20, //   #    
    0x0C, //     ## 
    0x70, //  ###   
    0x08, //     #  
    0x14, //    # # 
    0x08, //     #  
    0x00, //        
    0x00, //        
    0x00, //        

    // @72 '&' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x18, //    ##  
    0x20, //   #    
    0x20, //   #    
    0x54, //  # # # 
    0x48, //  #  #  
    0x34, //   ## # 
    0x00, //        
    0x00, //        
    0x00, //        

    // @84 ''' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @96 '(' (7 pixels wide)
    0x00, //        
    0x08, //     #  
    0x08, //     #  
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x08, //     #  
    0x08, //     #  
    0x00, //        

    // @108 ')' (7 pixels wide)
    0x00, //        
    0x20, //   #    
    0x20, //   #    
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x20, //   #    
    0x20, //   #    
    0x00, //        

    // @120 '*' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x7C, //  ##### 
    0x10, //    #   
    0x28, //   # #  
    0x28, //   # #  
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @132 '+' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0xFE, // #######
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x00, //        

    // @144 ',' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x18, //    ##  
    0x10, //    #   
    0x30, //   ##   
    0x20, //   #    
    0x00, //        

    // @156 '-' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @168 '.' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x30, //   ##   
    0x30, //   ##   
    0x00, //        
    0x00, //        
    0x00, //        

    // @180 '/' (7 pixels wide)
    0x00, //        
    0x04, //      # 
    0x04, //      # 
    0x08, //     #  
    0x08, //     #  
    0x10, //    #   
    0x10, //    #   
    0x20, //   #    
    0x20, //   #    
    0x40, //  #     
    0x00, //        
    0x00, //        

    // @192 '0' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @204 '1' (7 pixels wide)
    0x00, //        
    0x30, //   ##   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @216 '2' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x04, //      # 
    0x08, //     #  
    0x10, //    #   
    0x20, //   #    
    0x44, //  #   # 
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @228 '3' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x04, //      # 
    0x18, //    ##  
    0x04, //      # 
    0x04, //      # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @240 '4' (7 pixels wide)
    0x00, //        
    0x0C, //     ## 
    0x14, //    # # 
    0x14, //    # # 
    0x24, //   #  # 
    0x44, //  #   # 
    0x7E, //  ######
    0x04, //      # 
    0x0E, //     ###
    0x00, //        
    0x00, //        
    0x00, //        

    // @252 '5' (7 pixels wide)
    0x00, //        
    0x3C, //   #### 
    0x20, //   #    
    0x20, //   #    
    0x38, //   ###  
    0x04, //      # 
    0x04, //      # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @264 '6' (7 pixels wide)
    0x00, //        
    0x1C, //    ### 
    0x20, //   #    
    0x40, //  #     
    0x78, //  ####  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @276 '7' (7 pixels wide)
    0x00, //        
    0x7C, //  ##### 
    0x44, //  #   # 
    0x04, //      # 
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x00, //        

    // @288 '8' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @300 '9' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x3C, //   #### 
    0x04, //      # 
    0x08, //     #  
    0x70, //  ###   
    0x00, //        
    0x00, //        
    0x00, //        

    // @312 ':' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x30, //   ##   
    0x30, //   ##   
    0x00, //        
    0x00, //        
    0x30, //   ##   
    0x30, //   ##   
    0x00, //        
    0x00, //        
    0x00, //        

    // @324 ';' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x18, //    ##  
    0x18, //    ##  
    0x00, //        
    0x00, //        
    0x18, //    ##  
    0x30, //   ##   
    0x20, //   #    
    0x00, //        
    0x00, //        

    // @336 '<' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x0C, //     ## 
    0x10, //    #   
    0x60, //  ##    
    0x80, // #      
    0x60, //  ##    
    0x10, //    #   
    0x0C, //     ## 
    0x00, //        
    0x00, //        
    0x00, //        

    // @348 '=' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x7C, //  ##### 
    0x00, //        
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @360 '>' (7 pixels wide)
    0x00, //        
    0x00, //        
    0xC0, // ##     
    0x20, //   #    
    0x18, //    ##  
    0x04, //      # 
    0x18, //    ##  
    0x20, //   #    
    0xC0, // ##     
    0x00, //        
    0x00, //        
    0x00, //        

    // @372 '?' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x18, //    ##  
    0x24, //   #  # 
    0x04, //      # 
    0x08, //     #  
    0x10, //    #   
    0x00, //        
    0x30, //   ##   
    0x00, //        
    0x00, //        
    0x00, //        

    // @384 '@' (7 pixels wide)
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x4C, //  #  ## 
    0x54, //  # # # 
    0x54, //  # # # 
    0x4C, //  #  ## 
    0x40, //  #     
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        

    // @396 'A' (7 pixels wide)
    0x00, //        
    0x30, //   ##   
    0x10, //    #   
    0x28, //   # #  
    0x28, //   # #  
    0x28, //   # #  
    0x7C, //  ##### 
    0x44, //  #   # 
    0xEE, // ### ###
    0x00, //        
    0x00, //        
    0x00, //        

    // @408 'B' (7 pixels wide)
    0x00, //        
    0xF8, // #####  
    0x44, //  #   # 
    0x44, //  #   # 
    0x78, //  ####  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0xF8, // #####  
    0x00, //        
    0x00, //        
    0x00, //        

    // @420 'C' (7 pixels wide)
    0x00, //        
    0x3C, //   #### 
    0x44, //  #   # 
    0x40, //  #     
    0x40, //  #     
    0x40, //  #     
    0x40, //  #     
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @432 'D' (7 pixels wide)
    0x00, //        
    0xF0, // ####   
    0x48, //  #  #  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x48, //  #  #  
    0xF0, // ####   
    0x00, //        
    0x00, //        
    0x00, //        

    // @444 'E' (7 pixels wide)
    0x00, //        
    0xFC, // ###### 
    0x44, //  #   # 
    0x50, //  # #   
    0x70, //  ###   
    0x50, //  # #   
    0x40, //  #     
    0x44, //  #   # 
    0xFC, // ###### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @456 'F' (7 pixels wide)
    0x00, //        
    0x7E, //  ######
    0x22, //   #   #
    0x28, //   # #  
    0x38, //   ###  
    0x28, //   # #  
    0x20, //   #    
    0x20, //   #    
    0x70, //  ###   
    0x00, //        
    0x00, //        
    0x00, //        

    // @468 'G' (7 pixels wide)
    0x00, //        
    0x3C, //   #### 
    0x44, //  #   # 
    0x40, //  #     
    0x40, //  #     
    0x4E, //  #  ###
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @480 'H' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x44, //  #   # 
    0x7C, //  ##### 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0xEE, // ### ###
    0x00, //        
    0x00, //        
    0x00, //        

    // @492 'I' (7 pixels wide)
    0x00, //        
    0x7C, //  ##### 
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @504 'J' (7 pixels wide)
    0x00, //        
    0x3C, //   #### 
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x48, //  #  #  
    0x48, //  #  #  
    0x48, //  #  #  
    0x30, //   ##   
    0x00, //        
    0x00, //        
    0x00, //        

    // @516 'K' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x48, //  #  #  
    0x50, //  # #   
    0x70, //  ###   
    0x48, //  #  #  
    0x44, //  #   # 
    0xE6, // ###  ##
    0x00, //        
    0x00, //        
    0x00, //        

    // @528 'L' (7 pixels wide)
    0x00, //        
    0x70, //  ###   
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x24, //   #  # 
    0x24, //   #  # 
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @540 'M' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x6C, //  ## ## 
    0x6C, //  ## ## 
    0x54, //  # # # 
    0x54, //  # # # 
    0x44, //  #   # 
    0x44, //  #   # 
    0xEE, // ### ###
    0x00, //        
    0x00, //        
    0x00, //        

    // @552 'N' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x64, //  ##  # 
    0x64, //  ##  # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x4C, //  #  ## 
    0xEC, // ### ## 
    0x00, //        
    0x00, //        
    0x00, //        

    // @564 'O' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @576 'P' (7 pixels wide)
    0x00, //        
    0x78, //  ####  
    0x24, //   #  # 
    0x24, //   #  # 
    0x24, //   #  # 
    0x38, //   ###  
    0x20, //   #    
    0x20, //   #    
    0x70, //  ###   
    0x00, //        
    0x00, //        
    0x00, //        

    // @588 'Q' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x1C, //    ### 
    0x00, //        
    0x00, //        

    // @600 'R' (7 pixels wide)
    0x00, //        
    0xF8, // #####  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x78, //  ####  
    0x48, //  #  #  
    0x44, //  #   # 
    0xE2, // ###   #
    0x00, //        
    0x00, //        
    0x00, //        

    // @612 'S' (7 pixels wide)
    0x00, //        
    0x34, //   ## # 
    0x4C, //  #  ## 
    0x40, //  #     
    0x38, //   ###  
    0x04, //      # 
    0x04, //      # 
    0x64, //  ##  # 
    0x58, //  # ##  
    0x00, //        
    0x00, //        
    0x00, //        

    // @624 'T' (7 pixels wide)
    0x00, //        
    0xFE, // #######
    0x92, // #  #  #
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @636 'U' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @648 'V' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x44, //  #   # 
    0x28, //   # #  
    0x28, //   # #  
    0x28, //   # #  
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x00, //        

    // @660 'W' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x44, //  #   # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x28, //   # #  
    0x00, //        
    0x00, //        
    0x00, //        

    // @672 'X' (7 pixels wide)
    0x00, //        
    0xC6, // ##   ##
    0x44, //  #   # 
    0x28, //   # #  
    0x10, //    #   
    0x10, //    #   
    0x28, //   # #  
    0x44, //  #   # 
    0xC6, // ##   ##
    0x00, //        
    0x00, //        
    0x00, //        

    // @684 'Y' (7 pixels wide)
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x28, //   # #  
    0x28, //   # #  
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @696 'Z' (7 pixels wide)
    0x00, //        
    0x7C, //  ##### 
    0x44, //  #   # 
    0x08, //     #  
    0x10, //    #   
    0x10, //    #   
    0x20, //   #    
    0x44, //  #   # 
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @708 '[' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x38, //   ###  
    0x00, //        

    // @720 '\' (7 pixels wide)
    0x00, //        
    0x40, //  #     
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x10, //    #   
    0x10, //    #   
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x00, //        
    0x00, //        

    // @732 ']' (7 pixels wide)
    0x00, //        
    0x38, //   ###  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x38, //   ###  
    0x00, //        

    // @744 '^' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x10, //    #   
    0x28, //   # #  
    0x44, //  #   # 
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @756 '_' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0xFE, // #######

    // @768 '`' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x08, //     #  
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        

    // @780 'a' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x3C, //   #### 
    0x44, //  #   # 
    0x44, //  #   # 
    0x3E, //   #####
    0x00, //        
    0x00, //        
    0x00, //        

    // @792 'b' (7 pixels wide)
    0x00, //        
    0xC0, // ##     
    0x40, //  #     
    0x58, //  # ##  
    0x64, //  ##  # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0xF8, // #####  
    0x00, //        
    0x00, //        
    0x00, //        

    // @804 'c' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x3C, //   #### 
    0x44, //  #   # 
    0x40, //  #     
    0x40, //  #     
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @816 'd' (7 pixels wide)
    0x00, //        
    0x0C, //     ## 
    0x04, //      # 
    0x34, //   ## # 
    0x4C, //  #  ## 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x3E, //   #####
    0x00, //        
    0x00, //        
    0x00, //        

    // @828 'e' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x7C, //  ##### 
    0x40, //  #     
    0x40, //  #     
    0x3C, //   #### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @840 'f' (7 pixels wide)
    0x00, //        
    0x1C, //    ### 
    0x20, //   #    
    0x7C, //  ##### 
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @852 'g' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x36, //   ## ##
    0x4C, //  #  ## 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x3C, //   #### 
    0x04, //      # 
    0x38, //   ###  
    0x00, //        

    // @864 'h' (7 pixels wide)
    0x00, //        
    0xC0, // ##     
    0x40, //  #     
    0x58, //  # ##  
    0x64, //  ##  # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0xEE, // ### ###
    0x00, //        
    0x00, //        
    0x00, //        

    // @876 'i' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x00, //        
    0x70, //  ###   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @888 'j' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x00, //        
    0x78, //  ####  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x08, //     #  
    0x70, //  ###   
    0x00, //        

    // @900 'k' (7 pixels wide)
    0x00, //        
    0xC0, // ##     
    0x40, //  #     
    0x5C, //  # ### 
    0x48, //  #  #  
    0x70, //  ###   
    0x50, //  # #   
    0x48, //  #  #  
    0xDC, // ## ### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @912 'l' (7 pixels wide)
    0x00, //        
    0x30, //   ##   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @924 'm' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xE8, // ### #  
    0x54, //  # # # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x54, //  # # # 
    0xFE, // #######
    0x00, //        
    0x00, //        
    0x00, //        

    // @936 'n' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xD8, // ## ##  
    0x64, //  ##  # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0xEE, // ### ###
    0x00, //        
    0x00, //        
    0x00, //        

    // @948 'o' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x38, //   ###  
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x38, //   ###  
    0x00, //        
    0x00, //        
    0x00, //        

    // @960 'p' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xD8, // ## ##  
    0x64, //  ##  # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x78, //  ####  
    0x40, //  #     
    0xE0, // ###    
    0x00, //        

    // @972 'q' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x36, //   ## ##
    0x4C, //  #  ## 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x3C, //   #### 
    0x04, //      # 
    0x0E, //     ###
    0x00, //        

    // @984 'r' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x6C, //  ## ## 
    0x30, //   ##   
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @996 's' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x3C, //   #### 
    0x44, //  #   # 
    0x38, //   ###  
    0x04, //      # 
    0x44, //  #   # 
    0x78, //  ####  
    0x00, //        
    0x00, //        
    0x00, //        

    // @1008 't' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x20, //   #    
    0x7C, //  ##### 
    0x20, //   #    
    0x20, //   #    
    0x20, //   #    
    0x22, //   #   #
    0x1C, //    ### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @1020 'u' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xCC, // ##  ## 
    0x44, //  #   # 
    0x44, //  #   # 
    0x44, //  #   # 
    0x4C, //  #  ## 
    0x36, //   ## ##
    0x00, //        
    0x00, //        
    0x00, //        

    // @1032 'v' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x44, //  #   # 
    0x28, //   # #  
    0x28, //   # #  
    0x10, //    #   
    0x00, //        
    0x00, //        
    0x00, //        

    // @1044 'w' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x54, //  # # # 
    0x28, //   # #  
    0x00, //        
    0x00, //        
    0x00, //        

    // @1056 'x' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xCC, // ##  ## 
    0x48, //  #  #  
    0x30, //   ##   
    0x30, //   ##   
    0x48, //  #  #  
    0xCC, // ##  ## 
    0x00, //        
    0x00, //        
    0x00, //        

    // @1068 'y' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0xEE, // ### ###
    0x44, //  #   # 
    0x24, //   #  # 
    0x28, //   # #  
    0x18, //    ##  
    0x10, //    #   
    0x10, //    #   
    0x78, //  ####  
    0x00, //        

    // @1080 'z' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x7C, //  ##### 
    0x48, //  #  #  
    0x10, //    #   
    0x20, //   #    
    0x44, //  #   # 
    0x7C, //  ##### 
    0x00, //        
    0x00, //        
    0x00, //        

    // @1092 '{' (7 pixels wide)
    0x00, //        
    0x08, //     #  
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x20, //   #    
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x08, //     #  
    0x00, //        

    // @1104 '|' (7 pixels wide)
    0x00, //        
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x00, //        
    0x00, //        

    // @1116 '}' (7 pixels wide)
    0x00, //        
    0x20, //   #    
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x08, //     #  
    0x10, //    #   
    0x10, //    #   
    0x10, //    #   
    0x20, //   #    
    0x00, //        

    // @1128 '~' (7 pixels wide)
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x24, //   #  # 
    0x58, //  # ##  
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
    0x00, //        
];


pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
pins.spiFormat(8, 0)
pins.spiFrequency(18000000)

//% weight=20 color=#436EEE icon="\uf108"
namespace LCD1IN8 {
    //% blockId=LCD_Init
    //% blockGap=8
    //% block="LCD1IN8 Init"
    //% weight=200
    export function LCD_Init(): void{
        pins.digitalWritePin(DigitalPin.P8, 1);
        control.waitMicros(1000);
        pins.digitalWritePin(DigitalPin.P8, 0);
        control.waitMicros(1000);
        pins.digitalWritePin(DigitalPin.P8, 1);

        //ST7735R Frame Rate
        LCD_WriteReg(0xB1);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB2);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB3);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB4); //Column inversion
        LCD_WriteData_8Bit(0x07);

        //ST7735R Power Sequence
        LCD_WriteReg(0xC0);
        LCD_WriteData_8Bit(0xA2);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x84);
        LCD_WriteReg(0xC1);
        LCD_WriteData_8Bit(0xC5);

        LCD_WriteReg(0xC2);
        LCD_WriteData_8Bit(0x0A);
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0xC3);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0x2A);
        LCD_WriteReg(0xC4);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0xEE);

        LCD_WriteReg(0xC5); //VCOM
        LCD_WriteData_8Bit(0x0E);

        //ST7735R Gamma Sequence
        LCD_WriteReg(0xe0);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1a);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x18);
        LCD_WriteData_8Bit(0x2f);
        LCD_WriteData_8Bit(0x28);
        LCD_WriteData_8Bit(0x20);
        LCD_WriteData_8Bit(0x22);
        LCD_WriteData_8Bit(0x1f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x23);
        LCD_WriteData_8Bit(0x37);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xe1);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x17);
        LCD_WriteData_8Bit(0x33);
        LCD_WriteData_8Bit(0x2c);
        LCD_WriteData_8Bit(0x29);
        LCD_WriteData_8Bit(0x2e);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x39);
        LCD_WriteData_8Bit(0x3f);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x03);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xF0); //Enable test command
        LCD_WriteData_8Bit(0x01);

        LCD_WriteReg(0xF6); //Disable ram power save mode
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0x3A); //65k mode
        LCD_WriteData_8Bit(0x05);

        LCD_WriteReg(0x36); //MX, MY, RGB mode
        LCD_WriteData_8Bit(0xF7 & 0xA0); //RGB color filter panel
        
        //sleep out
        LCD_WriteReg(0x11);
        control.waitMicros(1000);

        //LCD_WriteReg(0x29);
        SPIRAM_Set_Mode(SRAM_BYTE_MODE);
    }
    
    //% blockId=LCD_Clear
    //% blockGap=8
    //% block="LCD Clear"
    //% weight=195
    export function LCD_Clear(): void{
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(0xFFFF, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }

    //% blockId=LCD_Filling
    //% blockGap=8
    //% block="Filling Color %Color"
    //% weight=195
    export function LCD_Filling(Color: COLOR): void{
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(Color, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }
	
	//% blockId=LCD_SetBL
    //% blockGap=8
    //% block="Set back light level %Lev"
	//% Lev.min=0 Lev.max=1023
    //% weight=180
    export function LCD_SetBL(Lev: number): void{
        pins.analogWritePin(AnalogPin.P1, 1023)
    }

    function LCD_WriteReg(reg: number): void {
        pins.digitalWritePin(DigitalPin.P12, 0);
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(reg);
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_WriteData_8Bit(Data: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1);
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(Data);
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_WriteData_Buf(Buf: number, len: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1);
        pins.digitalWritePin(DigitalPin.P16, 0);
        let i = 0;
        for(i = 0; i < len; i++) {
            pins.spiWrite((Buf >> 8));
            pins.spiWrite((Buf & 0XFF));
        }
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_SetWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        //set the X coordinates
        LCD_WriteReg(0x2A);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Xstart & 0xff) + 1);
        LCD_WriteData_8Bit(0x00 );
        LCD_WriteData_8Bit(((Xend - 1) & 0xff) + 1);

        //set the Y coordinates
        LCD_WriteReg(0x2B);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Ystart & 0xff) + 2);
        LCD_WriteData_8Bit(0x00 );
        LCD_WriteData_8Bit(((Yend - 1) & 0xff)+ 2);

        LCD_WriteReg(0x2C);
    }

    function LCD_SetColor(Color:number, Xpoint: number, Ypoint: number, ): void {
        LCD_WriteData_Buf(Color, Xpoint*Ypoint);
    }

    function LCD_SetPoint(Xpoint:number, Ypoint:number, Color:number): void {
        let Addr = (Xpoint + Ypoint * 160)* 2;
        SPIRAM_WR_Byte(Addr, Color >> 8);
        SPIRAM_WR_Byte(Addr + 1, Color & 0xff);
    }
    
    //% blockId=Draw_Clear
    //% blockGap=8
    //% block="Clear Drawing cache"
    //% weight=195
    export function LCD_ClearBuf(): void {
        let i;
        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRITE);
        pins.spiWrite(0);
        pins.spiWrite(0);
        pins.spiWrite(0);

        for (i = 0; i < 160 * 2 * 128; i++) {
            pins.spiWrite(0xff);
        }
        pins.digitalWritePin(DigitalPin.P2, 1);
    }
    
    //% blockId=LCD_Display
    //% blockGap=8
    //% block="Show Full Screen"
    //% weight=190
    export function LCD_Display(): void {
        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        LCD_SetWindows(0, 0, 160, 128);
        let rbuf = [];
        for (let i=0; i<640; i++) {
            rbuf[i] = 0;
        }

        let rdata = 0;
        for (let i = 0; i < 64; i++) { // read 2line
            pins.digitalWritePin(DigitalPin.P2, 0);
            pins.spiWrite(SRAM_CMD_READ);
            pins.spiWrite(0);
            pins.spiWrite((640*i)>>8);
            pins.spiWrite((640*i)&0xff);
            for(let offset = 0; offset<640; offset++){
                rbuf[offset] = pins.spiWrite(0x00);
            }
            pins.digitalWritePin(DigitalPin.P2, 1);

            pins.digitalWritePin(DigitalPin.P12, 1);
            pins.digitalWritePin(DigitalPin.P16, 0);
            for (let offset = 0; offset < 640; offset++) {
                pins.spiWrite(rbuf[offset]);
            }
            pins.digitalWritePin(DigitalPin.P16, 1);   
        }
       
        //Turn on the LCD display
        LCD_WriteReg(0x29);
    }
        
    //% blockId=DrawPoint
    //% blockGap=8
    //% block="Draw Point|x %Xpoint|y %Ypoint|Color %Color|Point Size %Dot_Pixel"
    //% Xpoint.min=1 Xpoint.max=160 Ypoint.min=1 Ypoint.max=128
    //% Color.min=0 Color.max=65535
    //% weight=150
    export function DrawPoint(Xpoint:number, Ypoint:number, Color:number, Dot_Pixel:DOT_PIXEL): void {
        let XDir_Num ,YDir_Num;
        for(XDir_Num = 0; XDir_Num < Dot_Pixel; XDir_Num++) {
            for(YDir_Num = 0; YDir_Num < Dot_Pixel; YDir_Num++) {
                LCD_SetPoint(Xpoint + XDir_Num - Dot_Pixel, Ypoint + YDir_Num - Dot_Pixel, Color);
            }
        }
    }

	//% blockId=DrawLine
	//% blockGap=8
	//% block="Draw Line|Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend|Color %Color|width %Line_width|Style %Line_Style"
	//% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
	//% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
	//% Color.min=0 Color.max=65535
	//% weight=140
    export function DrawLine(Xstart: number, Ystart: number, Xend: number, Yend: number, Color: number, Line_width: DOT_PIXEL, Line_Style: LINE_STYLE): void {
        if (Xstart > Xend)
            Swop_AB(Xstart, Xend);
        if (Ystart > Yend)
            Swop_AB(Ystart, Yend);

        let Xpoint = Xstart;
        let Ypoint = Ystart;
        let dx = Xend - Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
        let dy = Yend - Ystart <= 0 ? Yend - Ystart : Ystart - Yend;

        // Increment direction, 1 is positive, -1 is counter;
        let XAddway = Xstart < Xend ? 1 : -1;
        let YAddway = Ystart < Yend ? 1 : -1;

        //Cumulative error
        let Esp = dx + dy;
        let Line_Style_Temp = 0;

        for (; ;) {
            Line_Style_Temp++;
            //Painted dotted line, 2 point is really virtual
            if (Line_Style == LINE_STYLE.LINE_DOTTED && Line_Style_Temp % 3 == 0) {
                DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
                Line_Style_Temp = 0;
            } else {
                DrawPoint(Xpoint, Ypoint, Color, Line_width);
            }
            if (2 * Esp >= dy) {
                if (Xpoint == Xend) break;
                Esp += dy
                Xpoint += XAddway;
            }
            if (2 * Esp <= dx) {
                if (Ypoint == Yend) break;
                Esp += dx;
                Ypoint += YAddway;
            }
        }
    }
    
    //% blockId=DrawRectangle
    //% blockGap=8
    //% block="Draw Rectangle|Xstart2 %Xstart2|Ystart2 %Ystart2|Xend2 %Xend2|Yend2 %Yend2|Color %Color|Filled %Filled |Line width %Dot_Pixel"
    //% Xstart2.min=1 Xstart2.max=160 Ystart2.min=1 Ystart2.max=128 
    //% Xend2.min=1 Xend2.max=160 Yend2.min=1 Yend2.max=128
    //% Color.min=0 Color.max=65535
    //% weight=130
    export function DrawRectangle(Xstart2: number, Ystart2: number, Xend2: number, Yend2: number, Color: number, Filled: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        if (Xstart2 > Xend2)
            Swop_AB(Xstart2, Xend2);
        if (Ystart2 > Yend2)
            Swop_AB(Ystart2, Yend2);

        let Ypoint = 0;
        if (Filled) {
			for(Ypoint = Ystart2; Ypoint < Yend2; Ypoint++) {
				DrawLine(Xstart2, Ypoint, Xend2, Ypoint, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
			}
        } else {
            DrawLine(Xstart2, Ystart2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xstart2, Ystart2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
        }
    }

    //% blockId=DrawCircle
    //% blockGap=8
    //% block="Draw Circle|X_Center %X_Center|Y_Center %Y_Center|Radius %Radius|Color %Color|Filled %Draw_Fill|Line width %Dot_Pixel"
	//% X_Center.min=1 X_Center.max=160 Y_Center.min=1 Y_Center.max=128
	//% Radius.min=0 Radius.max=160
    //% Color.min=0 Color.max=65535
    //% weight=120
    export function DrawCircle(X_Center: number, Y_Center: number, Radius: number, Color: number, Draw_Fill: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        //Draw a circle from(0, R) as a starting point
        let XCurrent = 0;
        let YCurrent = Radius;

        //Cumulative error,judge the next point of the logo
        let Esp = 3 - (Radius << 1);

        let sCountY = 0;
        if (Draw_Fill == DRAW_FILL.DRAW_FULL) {//DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
            while (XCurrent <= YCurrent) { //Realistic circles
                for (sCountY = XCurrent; sCountY <= YCurrent; sCountY++) {
                    DrawPoint(X_Center + XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //1
                    DrawPoint(X_Center - XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //2
                    DrawPoint(X_Center - sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //3
                    DrawPoint(X_Center - sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //4
                    DrawPoint(X_Center - XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //5
                    DrawPoint(X_Center + XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //6
                    DrawPoint(X_Center + sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //7
                    DrawPoint(X_Center + sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                }
                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        } else { //Draw a hollow circle
            while (XCurrent <= YCurrent) {
                DrawPoint(X_Center + XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //1
                DrawPoint(X_Center - XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //2
                DrawPoint(X_Center - YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //3
                DrawPoint(X_Center - YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //4
                DrawPoint(X_Center - XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //5
                DrawPoint(X_Center + XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //6
                DrawPoint(X_Center + YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //7
                DrawPoint(X_Center + YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //0

                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        }
    }
    
    //% blockId=DisString
    //% blockGap=8
    //% block="Show String|X %Xchar|Y %Ychar|char %ch|Color %Color"
    //% Xchar.min=1 Xchar.max=160 Ychar.min=1 Ychar.max=128 
    //% Color.min=0 Color.max=65535
    //% weight=100
    export function DisString(Xchar: number, Ychar: number, ch: string, Color: number): void{
		let Xpoint = Xchar;
		let Ypoint = Ychar;
        let Font_Height = 12;
        let Font_Width = 7;
		let ch_len = ch.length;
		let i = 0;
		for(i = 0; i < ch_len; i++){
			let ch_asicc =  ch.charCodeAt(i) - 32;//NULL = 32
			let Char_Offset = ch_asicc * 12;
			
			if((Xpoint + Font_Width) > 160) {
				Xpoint = Xchar;
				Ypoint += Font_Height;
			}

			// If the Y direction is full, reposition to(Xstart, Ystart)
			if((Ypoint  + Font_Height) > 128) {
				Xpoint = Xchar;
				Ypoint = Ychar;
			}
			DisChar_1207(Xpoint, Ypoint, Char_Offset, Color);
			
			//The next word of the abscissa increases the font of the broadband
			Xpoint += Font_Width;
		} 
    }
    
    //% blockId=DisNumber
    //% blockGap=8
    //% block="Show number|X %Xnum|Y %Ynum|number %num|Color %Color"
    //% Xnum.min=1 Xnum.max=160 Ynum.min=1 Ynum.max=128 
    //% Color.min=0 Color.max=65535
    //% weight=100
    export function DisNumber(Xnum: number, Ynum: number, num: number, Color: number): void{
		let Xpoint = Xnum;
		let Ypoint = Ynum;
        DisString(Xnum, Ynum, num + "", Color);
    }

    function DisChar_1207(Xchar:number, Ychar:number, Char_Offset:number, Color:number): void {
        let Page = 0, Column = 0;
        let off = Char_Offset
        for(Page = 0; Page < 12; Page ++ ) {
            for(Column = 0; Column < 7; Column ++ ) {
                if(Font12_Table[off] & (0x80 >> (Column % 8)))
                    LCD_SetPoint(Xchar + Column, Ychar + Page, Color);

                //One pixel is 8 bits
                if(Column % 8 == 7)
                    off++;
            }// Write a line
            if(7 % 8 != 0)
                off++;
        }// Write all
    }

    //spi ram
    function SPIRAM_Set_Mode(mode:number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRSR);
        pins.spiWrite(mode);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function SPIRAM_RD_Byte(Addr:number): number{
        let RD_Byte;        
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_READ);
        pins.spiWrite(0X00);
        pins.spiWrite(Addr >> 8);
        pins.spiWrite(Addr);
        RD_Byte = pins.spiWrite(0x00);
        pins.digitalWritePin(DigitalPin.P2, 1);

        return RD_Byte;
    }

    function SPIRAM_WR_Byte(Addr:number, Data:number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRITE);
        pins.spiWrite(0X00);
        pins.spiWrite(Addr >> 8);
        pins.spiWrite(Addr);        
        pins.spiWrite(Data);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function Swop_AB(Point1: number, Point2: number): void {
        let Temp = 0;
        Temp = Point1;
        Point1 = Point2;
        Point2 = Temp;
    }
}
